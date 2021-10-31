const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zctf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("turodb");

    const touristPlaceCollection = database.collection("tourist_place");
    const tourBlogCollection = database.collection("tour_blog");
    const bookingTour = database.collection("booking");

    //GET API for tourist_place
    app.get("/tourist_place", async (req, res) => {
      const cursor = touristPlaceCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //GET API for tour_blog
    app.get("/tour_blog", async (req, res) => {
      const cursor = tourBlogCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //GET API for all booking
    app.get("/booking", async (req, res) => {
      const cursor = bookingTour.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //GET API
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingTour.findOne(query);
      res.json(result);
    });

    //POST API
    app.post("/tourist_place", async (req, res) => {
      const place = req.body;
      const result = await touristPlaceCollection.insertOne(place);
      res.json(result);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    });

    //POST API FOR BOOKING
    app.post("/booking", async (req, res) => {
      const place = req.body;
      const result = await bookingTour.insertOne(place);
      res.json(result);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    });

    //DELETE API USING OBJECT ID
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingTour.deleteOne(query);
      res.json(result);
    });

    //get my booking using email
    app.get("/booking/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = bookingTour.find({ email: email });
      const result = await cursor.toArray();
      res.json(result);
    });

    // //UPDATE PUT API
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      console.log('hitting with id', updateStatus.status);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { status: updateStatus.status },
      };
      const result = await bookingTour.updateOne(filter, updateDoc, options);
      res.send(result);
    });


  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello TURO!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// turodb
// 07VaBJfj9a9Cqwcw
