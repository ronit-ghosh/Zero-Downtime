import { xAck, xReadGroup } from "@zero-downtime/redis/client";
import { xAddDb } from "@zero-downtime/redis/db-pusher";
import axios from "axios";
import { config } from "dotenv";

config({ path: "../../.env", quiet: true });

const REGION_ID = process.env.REGION_ID as string;
const WORKER_ID = process.env.WORKER_ID as string;

interface Website {
  id: string;
  url: string;
  statusCode?: number;
  responseMs?: number;
}

async function notifyUser(website: Website) {
  console.log(`message sent to ${website.url}'s owner`);
}

async function HitWebsiteUrl(
  website: Website
): Promise<{ statusCode: number; responseMs?: number } | undefined> {
  try {
    const url = website.url.startsWith("https://")
      ? website.url
      : `https://${website.url}`;
    const startTime = Date.now();
    const response = await axios.get(url);
    const endTime = Date.now();
    const responseMs = endTime - startTime;
    return {
      statusCode: response.status,
      responseMs,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        `${website.url} returned `,
        error.code,
        error.response?.status
      );
      if (error.response?.status)
        return {
          statusCode: error.response.status,
        };
      return undefined;
    } else {
      console.error("Non-Axios error:", error);
      return undefined;
    }
  }
}

async function addToDbPusher(website: Website) {
  const response = await xAddDb({
    responseTimeMs: website.responseMs || 0,
    status: website.statusCode
      ? website.statusCode === 200
        ? "UP"
        : "DOWN"
      : "UNKNOWN",
    statusCode: website.statusCode || 500,
    websiteId: website.id,
  });

  console.log("added to the stream: " + response + "\n");
}

async function main() {
  try {
    if (!REGION_ID || !WORKER_ID) {
      throw new Error("`REGION_ID` `WORKER_ID` is not present in .env");
    }
    const response = await xReadGroup(REGION_ID, WORKER_ID);
    if (!response) {
      console.error("Stream is empty!");
      return;
    }
    // @ts-ignore TODO: find how to infer proper types
    for (const res of response[0].messages) {
      const response = await HitWebsiteUrl({
        id: res.message.id,
        url: res.message.url,
      });

      if (!response) {
        console.error("[worker]: Not hitting the url", res.message.url);
        continue;
      }

      const data = {
        id: res.message.id,
        url: res.message.url,
        responseMs: response.responseMs || 0,
        statusCode: response.statusCode,
      };

      if (response.statusCode !== 200) {
        notifyUser(data);
      }

      await addToDbPusher(data);
     
      const ackResult = await xAck(REGION_ID, res.id);
      console.log(ackResult, "acknowledged!");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

main();
setInterval(() => {
  main();
}, 10000);
