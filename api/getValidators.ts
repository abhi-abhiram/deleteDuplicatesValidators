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
  const { address, startDate, endDate } = req.body;
  let result;
  if (address) {
    result = await db
      .collection("validators")
      .find({
        searchedAddress: address,
        date: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      })
      .limit(1000)
      .toArray();
  } else {
    result = await db
      .collection("validators")
      .find({
        date: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      })
      .limit(1000)
      .toArray();
  }

  const output = [];

  for (let count1 = 0; count1 < result.length; count1++) {
    for (let count2 = 0; count2 < result.length; count2++) {
      if (
        result[count1].validator === result[count2].validator &&
        result[count1].epoch === result[count2].epoch &&
        result[count1]._id !== result[count2]._id &&
        result[count1].searchedAddress === result[count2].searchedAddress
      ) {
        output.push(result.splice(count2, 1)[0]);
      }
    }
  }

  res.status(200).json(output);
};
