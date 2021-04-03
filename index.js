const express = require("express");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ddki.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const products = client.db("emaJohnStore").collection("products");
  const orders = client.db("emaJohnStore").collection("orders");
  // perform actions on the collection object
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    products.insertMany(product).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });
  app.get("/products", (req, res) => {
    products.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/product/:key", (req, res) => {
    products.find({ key: req.params.key }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });
  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    console.log(productKeys);
    products.find({ key: { $in: productKeys } }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/addOrder", (req, res) => {
    const currOrder = req.body;
    orders.insertOne(currOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
