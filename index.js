const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { query } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASS;

const uri = `mongodb+srv://${db_user}:${db_password}@cluster0.d4mp0ot.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client.db("busHub").collection("categories");
    const usersCollection = client.db("busHub").collection("users");
    const productsCollection = client.db("busHub").collection("products");

    // Users

    app.get("/users", async (req, res) => {
      const query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = usersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      // const newUser = req.body.email;
      // console.log(newUser);

      const existUser = await usersCollection.findOne(user);

      if (!existUser) {
        const result = await usersCollection.insertOne(user);
        res.send(result);
      }
    });

    // categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    // product

    app.get("/products", async (req, res) => {
      let query = {};
      if (req.query.category) {
        query = {
          category: req.query.category,
        };
      }

      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
  } finally {
    //finally
  }
}
run();

app.get("/", (req, res) => {
  res.send("Bus Hub Server running");
});

app.listen(port, () => {
  console.log(`server running on  port ${port}`);
});
