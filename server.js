const express = require("express");
const mongoose = require("mongoose");
const Web3 = require("web3");
const cors = require("cors");
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

// Define the schemas for the users and contents collections
const userSchema = new mongoose.Schema({
  name: { type: String, default: "anonymous" },
  wallet: { type: String, required: true, unique: true },
  ownedContent: { type: Number, default: 0 },
  joinedOn: { type: Date, default: Date.now },
});
const contentSchema = new mongoose.Schema({
  image: { type: String, required: true },
  tokenAddress: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdOn: { type: Date, default: Date.now },
});

const Content = mongoose.model("Content", contentSchema);
const User = mongoose.model("User", userSchema);

// Add a new user to the users collection or return the existing user ID
app.get("/user/add/:wallet", async (req, res) => {
  const wallet = req.params.wallet;

  try {
    const user = await User.findOne({ wallet });

    if (user) {
      res.status(200).json({ message: "User found", data: { id: user._id } });
    } else {
      const newUser = new User({
        wallet,
      });
      const result = await newUser.save();

      res.status(200).json({ message: "User added", data: { id: result._id } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding user" });
  }
});

// Get all users from the users collection
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting users" });
  }
});

// Get a user by wallet address
app.get("/user/:wallet", async (req, res) => {
  const wallet = req.params.wallet;

  try {
    const user = await User.findOne({ wallet });

    if (user) {
      res.status(200).json({ message: "User found", data: { id: user._id } });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting user" });
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
    res.status(200).json({ count, countLast24h });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting user count" });
  }
});

// Add a new content to the contents collection or return the existing content ID
app.post("/content/add", async (req, res) => {
  try {
    const { image, tokenAddress, title, authorId } = req.body;
    const existingContent = await Content.findOne({ tokenAddress });
    if (existingContent) {
      return res.status(200).json({ existingContentId: existingContent._id });
    }
    const newContent = new Content({ image, tokenAddress, title, authorId });
    const savedContent = await newContent.save();
    await User.findByIdAndUpdate(authorId, { $inc: { ownedContent: 1 } });
    res.status(200).json({ newContentId: savedContent._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding content" });
  }
});

// Get all contents from the contents collection
app.get("/contents", async (req, res) => {
  try {
    const contents = await Content.find();
    res.status(200).json(contents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting contents" });
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
    res.status(200).json({ count, countLast24h });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting content count" });
  }
});

// Get the number of transactions for the contract
app.get("/contents/sale-count", async (req, res) => {
  try {
    const count = await CONTRACT_INSTANCE.methods.getListedItemsCount().call();
    res.status(200).json({ count, CONTRACT_ADDRESS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting transaction count" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
