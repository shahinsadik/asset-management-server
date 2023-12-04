const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const stripe = require("stripe")(
  "sk_test_51OFVfqDqdT1eaxGhxMfh2d7CKTogF7tpk0syj6jTysiIsGD6kY3zvcAmlTUi5N4Pc4EpYjKobahrBWKbQA69a7sq00faNyVnbZ"
);

const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.lz5tib6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	

    const userCollection = client.db("assertManagement").collection("users");
    const cartCollection = client.db("assertManagement").collection("cart");
    const paymentCollection = client
      .db("assertManagement")
      .collection("payments");
    const hrCollection = client.db("assertManagement").collection("hr");
    const assetCollection = client.db("assertManagement").collection("assets");
    const customAssetCollection = client
      .db("assertManagement")
      .collection("custom-assets");
    const teamCollection = client.db("assertManagement").collection("teams");
    const reqAssetCollection = client
      .db("assertManagement")
      .collection("req-assets");

    app.post("/teams", async (req, res) => {
      const member = req.body;
      const result = await teamCollection.insertOne(member);
      res.send(result);
    });

    app.get("/full-teams", async (req, res) => {
      // const email = req.query.email;
      const result = await teamCollection.find().toArray();

      res.send(result);
    });

    app.get("/teams", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await teamCollection.findOne(query);

      res.send(result);
    });
    app.get("/myTeams", async (req, res) => {
      const result = await teamCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/teams/member", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await teamCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/teams/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await teamCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/assets", async (req, res) => {
      const cartItem = req.body;
      const result = await assetCollection.insertOne(cartItem);
      res.send(result);
    });
    app.get("/assets", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await assetCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/assets/ad", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await assetCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/approved-assets", async (req, res) => {
      const approvedEmail = req.query.email;

      const query = { email: approvedEmail };
      const result = await reqAssetCollection.find(query).toArray();

      res.send(result);
    });

    app.get("/assets/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await assetCollection.findOne(query);
      res.send(result);
    });

    app.delete("/assets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assetCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/custom-assets/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await customAssetCollection.deleteOne(query);

      res.send(result);
    });

    app.patch("/custom-assets/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          isPending: true,
        },
      };
      const result = await customAssetCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.get("/custom-assets", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await customAssetCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/custom-assets/list", async (req, res) => {
      const email = req.query.email;
      const query = { adminEmail: email };

      const result = await customAssetCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/custom-assets/ad", async (req, res) => {
      const email = req.query.email;
      const query = { adminEmail: email };

      const result = await customAssetCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/custom-assets/hr", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await customAssetCollection.find(query).toArray();
      res.send(result);
    });

    // app.get("/custom-assets", async (req, res) => {

    //   const result = await customAssetCollection.find().toArray();
    //   res.send(result);
    // });

    app.post("/custom-assets", async (req, res) => {
      const cartItem = req.body;
      const result = await customAssetCollection.insertOne(cartItem);
      res.send(result);
    });

    app.delete("/req-assets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reqAssetCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/req-assets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          isPending: true,
        },
      };
      const result = await reqAssetCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.get("/req-assets/all", async (req, res) => {
      const email = req.query.email;
      console.log("req", email);
      const query = { userEmail: email };
      const result = await reqAssetCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/req-assets/ad", async (req, res) => {
      
      const result = await reqAssetCollection.find().toArray();
      res.send(result);
    });

    app.get("/req-assets/hr", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log(email, query);
      const result = await reqAssetCollection.find(query).toArray();
      res.send(result);
    });
    

    app.post("/req-assets", async (req, res) => {
      const cartItem = req.body;
      const result = await reqAssetCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get("/assets/search", async (req, res) => {
      const {
        email,
        searchQuery,
        availabilityFilter,
        assetTypeFilter,
        requestStatusFilter,
      } = req.query;

      try {
        let query = {};
        if (email) {
          query.userEmail = email;
        }

        if (searchQuery) {
          query.$or = [
            { productName: { $regex: new RegExp(searchQuery, "i") } },
            { additionalInfo: { $regex: new RegExp(searchQuery, "i") } },
          ];
        }

        if (availabilityFilter !== "all") {
          query.isPending = availabilityFilter === "true";
        }

        if (assetTypeFilter !== "all") {
          query.productType = assetTypeFilter;
        }

        // Add similar conditions for requestStatusFilter or customize as needed

        const result = await assetCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching assets:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/assets/all", async (req, res) => {
      const {
        email,
        availabilityFilter,
        assetTypeFilter,
        requestStatusFilter,
      } = req.query;

      try {
        let query = {};
        if (email) {
          query.userEmail = email;
        }

        if (availabilityFilter !== "all") {
          query.isPending = availabilityFilter === "true";
        }

        // Add similar conditions for assetTypeFilter and requestStatusFilter

        const result = await assetCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching all assets:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    //
    app.patch("/hr/:email", async (req, res) => {
      const userEmail = req.params.email;

      const query = { email: userEmail };
      const updatedDoc = {
        $set: {
          isPayment: true,
        },
      };
      const result = await hrCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };
      const exitingUser = await userCollection.findOne(query);
      if (exitingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const { fullName, dateOfBirth } = req.body;
      const result = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            displayName: fullName,
            dob: dateOfBirth,
          },
        }
      );
      res.send(result);
    });
    app.patch("/hr/:id", async (req, res) => {
      const userId = req.params.id;
      const { fullName, dateOfBirth } = req.body;
      const result = await hrCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            displayName: fullName,
            dob: dateOfBirth,
          },
        }
      );
      res.send(result);
    });

    app.get("/hr", async (req, res) => {
      const result = await hrCollection.find().toArray();
      res.send(result);
    });

    app.post("/hr", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };
      const exitingUser = await hrCollection.findOne(query);
      if (exitingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }
      const result = await hrCollection.insertOne(user);
      res.send(result);
    });

    app.get("/hr/role", async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail };
      const result = await hrCollection.findOne(query);
      res.send(result);
    });

    app.get(
      "/hr/admin",

      async (req, res) => {
        const email = req.query.email;
        console.log(email);
        // if (email !== req.decoded.email) {
        //   return res.status(403).send({ message: "Forbidden" });
        // }
        const query = { email: email };
        const user = await hrCollection.findOne(query);
        let admin = false;
        if (user) {
          admin = user?.isPayment === true;
        }
        res.send({ admin });
      }
    );

    app.patch("/hr/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "true",
        },
      };

      const result = await hrCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const paymentResult = await paymentCollection.insertOne(payment);

      res.send(paymentResult);
    });
    app.get("/payments/:email", async (req, res) => {
      const query = { email: req.params.email };
      if (req.params.email !== req.decoded.email) {
        return req.status(403).send({ message: "Forbidden access" });
      }
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "USD",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // Send a ping to confirm a successful connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the Asset management");
});
app.listen(port, () => {
  console.log(`Asset management is running port  ${port}`);
});
