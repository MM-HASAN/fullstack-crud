const express = require("express");
//import express from "express";

const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
const { ObjectId } = require("bson");
const uri =
  "mongodb+srv://fullstack-crud:fullstack-crud21@cluster0.lm8iq.mongodb.net/fullstack-crud?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const nameCollection = client
    .db("fullstack-crud")
    .collection("fullstack-crud");

  app.get("/names", (req, res) => {
    nameCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get(`/name/:id`, (req, res) => {
    nameCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/addName", (req, res) => {
    const myDocuments = req.body;
    nameCollection.insertOne(myDocuments).then((result) => {
      console.log("data added successfully");
    });
    res.send("data added success");
  });

  app.delete("/delete/:id", (req, res) => {
    nameCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
      });
    console.log(req.params.id);
  });
});

app.listen(4000, () => {
  console.log("database running");
});
