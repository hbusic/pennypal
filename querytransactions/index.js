const { MongoClient } = require("mongodb");

module.exports = async function (context, req) {
  try {
    const uri = process.env["MONGO_URI"];
    context.log("Loaded URI:", uri);

    const client = new MongoClient(uri, {
      serverApi: { version: "1" }
    });

    await client.connect();
    context.log("Connected to MongoDB");

    const db = client.db("pennypal");
    const collection = db.collection("transactions");

    // No limit — returns all matching transactions
    const results = await collection.find({}).toArray();

    context.res = {
      status: 200,
      body: results
    };
  } catch (err) {
    context.log.error("MongoDB connection failed:", err);
    context.res = {
      status: 500,
      body: `Connection failed: ${err.message}`
    };
  }
};

