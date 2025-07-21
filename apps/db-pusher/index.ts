import prisma from "@zero-downtime/db/client";
import { xAckDb, xReadGroupDb } from "@zero-downtime/redis/db-pusher";
import { config } from "dotenv"

config({ path: "../../.env", quiet: true });

const DB_PUSHER_ID = process.env.DB_PUSHER_ID as string;
const DB_PUSHER_WORKER_ID = process.env.DB_PUSHER_WORKER_ID as string;

async function main() {
  try {
    if (!DB_PUSHER_WORKER_ID || !DB_PUSHER_ID) {
      throw new Error("`REGION_ID` `WORKER_ID` is not present in .env");
    }

    const response = await xReadGroupDb(DB_PUSHER_ID, DB_PUSHER_WORKER_ID);
    if (!response) {
      console.error("Stream is empty!");
      return;
    }
    // @ts-ignore TODO: find how to infer proper types
    for (const res of response[0].messages) {
      const response = await prisma.websiteTick.create({
        data: {
          responseTimeMs: Number(res.message.responseTimeMs),
          status: res.message.status,
          statusCode: Number(res.message.statusCode),
          errorCode: res.message.errorCode,
          Website: {
            connect: {
              id: res.message.websiteId,
            }
          }
        },
      });
      const ackResult = await xAckDb(DB_PUSHER_ID, res.id);
      console.log(ackResult, response.websiteId, "acknowledged!");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

setInterval(() => {
  main();
}, 1000);
