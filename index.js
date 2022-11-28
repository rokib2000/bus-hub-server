const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//**************** */
// middleware
//**************** */

app.use(cors());
app.use(express.json());

//***************** */
//database
//***************** */

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
    const ordersCollection = client.db("busHub").collection("orders");

    //**********************/
    // User
    //******************** */

    // get user data
    app.get("/users", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      // console.log(req.query.role);
      if (req.query.role) {
        query = {
          accountType: req.query.role,
        };
      }

      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // post user data
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

    //**********************/
    // categories
    //******************** */

    //get all categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    //**********************/
    // Products
    //******************** */

    //get all product data
    app.get("/products", async (req, res) => {
      let query = {};
      if (req.query.category) {
        query = {
          category: req.query.category,
        };
      }

      if (req.query.status) {
        query = {
          status: req.query.status,
        };
      }

      const sort = { date: -1 };
      const cursor = productsCollection.find(query).sort(sort);
      const products = await cursor.toArray();
      res.send(products);
    });

    // get single Product data
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    //post one product data
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    //update product report data
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await productsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    //product delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    //************** */
    //Order
    //************** */

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
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
