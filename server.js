const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();

//middleware
app.use(cors());
app.use(express.json()); //parse json

//mongoDB uri
const uri = process.env.ATLAS_URI;
mongoose.connect(
  uri,
  { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true } //flags
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//routes APIs
const usersRouter = require("./routes/api/users");
const authRouter = require("./routes/api/auth");
const itemsRouter = require("./routes/api/items");

app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/auth", authRouter);

// serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.port || 4000;

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
