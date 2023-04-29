// const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3010;

// app.use(cors());

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Define the user schema
const userSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
});

// Create the user model from the schema
const User = mongoose.model("User", userSchema);

app.get("/user/add/:wallet", async (req, res) => {
  const wallet = req.params.wallet;

  try {
    const user = await User.findOne({ wallet });

    if (user) {
      res.status(200).json({ message: "User found", data: { id: user._id } });
    } else {
      const newUser = new User({ wallet });
      const result = await newUser.save();

      res.status(200).json({ message: "User added", data: { id: result._id } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding user" });
  }
});

// app.get("/user/add/:wallet", async (req, res) => {
//   const wallet = req.params.wallet;

//   try {
//     const client = await MongoClient.connect(uri);
//     const db = client.db("cnft-db");
//     const users = db.collection("users");

//     const result = await users.insertOne({ wallet });

//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.status(200).json({ message: "User added", data: result.ops[0] });
//   } catch (err) {
//     console.error(err);
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.status(500).json({ message: "Error adding user" });
//   }
// });

// app.get("/ipfs/:hash", async (req, res) => {
//   const url = `https://ipfs.io/ipfs/${req.params.hash}`;
//   const response = await axios.get(url, { responseType: "arraybuffer" });
//   const buffer = Buffer.from(response.data, "utf-8");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.status(200).send(buffer);
// });

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
