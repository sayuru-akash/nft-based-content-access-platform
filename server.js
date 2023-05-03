const express = require("express");
const mongoose = require("mongoose");
const Web3 = require("web3");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const NftMarket = require("./build/contracts/NftMarket.json");

const app = express();
app.use(express.json());
app.use(cors());
const port = 3010;

const mongoUri = process.env.MONGODB_URI;
const ganacheUrl = process.env.GANACHE_URL;

const web3 = new Web3(ganacheUrl);
const CONTRACT_ADDRESS = "0x82E9A535DE8148505BD1F2E0642193737440b044";
const CONTRACT_INSTANCE = new web3.eth.Contract(
  NftMarket.abi,
  CONTRACT_ADDRESS
);

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "cnft-db",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Define the schemas for the admin, users, and contents collections
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
});
const userSchema = new mongoose.Schema({
  name: { type: String, default: "anonymous" },
  wallet: { type: String, required: true, unique: true },
  ownedContent: { type: Number, default: 0 },
  joinedOn: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
});
const contentSchema = new mongoose.Schema({
  image: { type: String, required: true },
  tokenId: { type: String, required: true, unique: true, default: "0" },
  title: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdOn: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
  encKey: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);
const Content = mongoose.model("Content", contentSchema);
const User = mongoose.model("User", userSchema);

// Add a new user to the users collection or return the existing user ID
app.get("/user/add/:wallet", async (req, res) => {
  const wallet = req.params.wallet;

  try {
    const user = await User.findOne({ wallet });
    if (user) {
      return res
        .status(200)
        .json({ message: "User found", data: { id: user._id } });
    } else {
      const newUser = new User({
        wallet,
      });
      const result = await newUser.save();

      return res
        .status(200)
        .json({ message: "User added", data: { id: result._id } });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error adding user" });
  }
});

// Get all users from the users collection
app.get("/users", async (req, res) => {
  const searchQuery = req.query.search;
  try {
    let users;
    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      users = await User.find({ $or: [{ wallet: regex }, { name: regex }] });
    } else {
      users = await User.find();
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting users" });
  }
});

// Get a user by wallet address
app.get("/user/:wallet", async (req, res) => {
  const wallet = req.params.wallet;

  try {
    const user = await User.findOne({ wallet });
    if (user) {
      return res
        .status(200)
        .json({ message: "User found", data: { id: user._id } });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting user" });
  }
});

// Get the count of all users in the users collection and the count of users who joined in the last 24 hours
app.get("/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    const now = new Date();
    const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const countLast24h = await User.countDocuments({
      joinedOn: { $gte: lastDay },
    });
    return res.status(200).json({ count, countLast24h });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting user count" });
  }
});

// Ban or unban a user
app.post("/user/status", async (req, res) => {
  const { userId, status } = req.body;
  const user = await User.findOne({ _id: userId });
  if (user) {
    if (user.status === status) {
      return res.status(200).json({ message: "User status unchanged" });
    } else {
      user.status = status;
      await user.save();
      return res.status(200).json({ message: "User status updated" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// Delete a user by user ID
app.get("/user/delete/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (user) {
      return res.status(200).json({ message: "User deleted" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting user" });
  }
});

// Add a new content to the contents collection or return the existing content ID
app.post("/content/add", async (req, res) => {
  try {
    const { image, tokenId, title, authorId, encKey } = req.body;
    const existingContent = await Content.findOne({ tokenId });
    if (existingContent) {
      return res.status(200).json({ existingContentId: existingContent._id });
    }
    const newContent = new Content({
      image,
      tokenId,
      title,
      authorId,
      encKey,
      status: true,
    });
    const savedContent = await newContent.save();
    await User.findByIdAndUpdate(authorId, { $inc: { ownedContent: 1 } });
    return res.status(200).json({ newContentId: savedContent._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error adding content" });
  }
});

// Get all contents from the contents collection
app.get("/contents", async (req, res) => {
  const searchQuery = req.query.search;
  try {
    let contents;
    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      contents = await Content.find({
        $or: [{ title: regex }, { tokenId: regex }],
      });
    } else {
      contents = await Content.find();
    }
    const users = await User.find();
    const contentWithUserStatus = contents.map((content) => {
      const user = users.find(
        (user) => user._id.toString() === content.authorId.toString()
      );
      return { ...content._doc, authorStatus: user.status };
    });
    return res.status(200).json(contentWithUserStatus);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting contents" });
  }
});

// Get content by token id
app.get("/content/:tokenId", async (req, res) => {
  const tokenId = req.params.tokenId;
  try {
    const content = await Content.findOne({ tokenId });
    if (content) {
      return res.status(200).json({ message: "Content Found", content });
    } else {
      return res.status(404).json({ message: "Content not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting content" });
  }
});

// Get the count of all contents in the contents collection and the count of contents created in the last 24 hours
app.get("/contents/count", async (req, res) => {
  try {
    const count = await Content.countDocuments();
    const now = new Date();
    const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const countLast24h = await Content.countDocuments({
      createdOn: { $gte: lastDay },
    });
    return res.status(200).json({ count, countLast24h });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting content count" });
  }
});

// Get the number of transactions for the contract
app.get("/contents/sale-count", async (req, res) => {
  try {
    const count = await CONTRACT_INSTANCE.methods.getListedItemsCount().call();
    return res.status(200).json({ count, CONTRACT_ADDRESS });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting transaction count" });
  }
});

// Ban or unban a content
app.post("/content/status", async (req, res) => {
  const { contentId, status } = req.body;
  const content = await Content.findOne({ _id: contentId });
  if (content) {
    if (content.status === status) {
      return res.status(200).json({ message: "Content status unchanged" });
    } else {
      content.status = status;
      await content.save();
      return res.status(200).json({ message: "Content status updated" });
    }
  } else {
    return res.status(404).json({ message: "Content not found" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const pwd = password;
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      const extPwd = existingUser.password;
      const compare = await bcrypt.compare(pwd, extPwd).then(async (result) => {
        return result;
      });
      if (compare === true) {
        return res.status(200).json({ message: "Authentication successful" });
      } else {
        return res
          .status(401)
          .json({ message: "Password authentication failed" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Username authentication failed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error authenticating user" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
