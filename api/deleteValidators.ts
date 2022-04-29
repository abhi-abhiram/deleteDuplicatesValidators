import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const config = {
  url: process.env.COSMOSDB,
  dbName: "radixdb",
};

module.exports = async function (req: VercelRequest, res: VercelResponse) {
  const client = new MongoClient(config.url ? config.url : "");
  await client.connect();
  const db = client.db(config.dbName);

  const data = req.body;

  const result = [];
  for (let count = 0; count < data.length; count++) {
    result.push(
      await db.collection("validators").deleteOne({ _id: data[count]._id })
    );
  }

  res.status(200).json(result);
};
