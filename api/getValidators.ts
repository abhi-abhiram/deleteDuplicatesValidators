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
  const { address } = req.body;
  let result: any[];

  let start_date = new Date(req.body.startDate).toUTCString().slice(0, -4);
  let end_date = new Date(req.body.endDate).toUTCString().slice(0, -4);
  let start = new Date(start_date).setHours(24);
  let utc_end_date = new Date(end_date);
  let end = utc_end_date.setHours(24);

  if (address) {
    result = await db
      .collection("validators")
      .find({
        searchedAddress: address,
        date: {
          $gte: start,
          $lte: end,
        },
      })
      .toArray();
  } else {
    result = await db
      .collection("validators")
      .find({
        date: {
          $gte: start,
          $lte: end,
        },
      })
      .limit(1000)
      .toArray();
  }

  const output: any[] = [];

  result.forEach((value1, index1) => {
    result.forEach((value2, index2) => {
      if (
        value1.validator === value2.validator &&
        value1.epoch === value2.epoch &&
        value1.searchedAddress === value2.searchedAddress &&
        index1 !== index2
      ) {
        result.splice(index2, 1);
        output.push(value2);
      }
    });
  });

  res.status(200).json(output);
};
