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
  let result;

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

  const trackEpoch: number[] = [];

  const output = [];
  for (let count1 = 0; count1 < result.length; count1++) {
    if (trackEpoch.includes(result[count1].epoch)) {
      continue;
    } else {
      trackEpoch.push(trackEpoch.push(result[count1].epoch));
    }

    for (let count2 = 0; count2 < result.length; count2++) {
      if (
        result[count1].validator === result[count2].validator &&
        result[count1].epoch === result[count2].epoch &&
        result[count1].searchedAddress === result[count2].searchedAddress &&
        count1 !== count2
      ) {
        output.push(result[count2]);
      }
    }
  }

  res.status(200).json(output);
};
