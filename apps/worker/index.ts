import { xReadGroup } from "@zero-downtime/redis/client";
import axios, { AxiosError } from "axios";
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
    const startTime = Date.now();
    const response = await axios.get(website.url);
    const endTime = Date.now();
    const responseMs = endTime - startTime;
    return {
      statusCode: response.status,
      responseMs,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(`${website.url} returned `, error.code, error.status);
      if (error.status)
        return {
          statusCode: error.status,
        };
      return undefined;
    }
  }
}

async function addToDbPusher(website: Website) {
  console.log(
    `pushed ${website.url} to db queue, response time is ${website.responseMs}, status code returned ${website.statusCode}`
  );
}

async function main() {
  try {
    if (!REGION_ID || !WORKER_ID) {
      throw new Error("`REGION_ID` `WORKER_ID` is not present in .env");
    }
    while (1) {
      const response = await xReadGroup(REGION_ID, WORKER_ID);
      // @ts-ignore TODO: find how to infer proper types
      const result = response[0].messages.forEach(async (res) => {
        const response = await HitWebsiteUrl({
          id: res.messages.id,
          url: res.messages.url,
        });

        const data = {
          id: res.messages.id,
          url: res.messages.url,
          responseMs: response?.responseMs || 0,
          statusCode: response?.statusCode,
        };

        if (response?.statusCode !== 200) {
          notifyUser(data);
        }

        await addToDbPusher(data);
      });

      await Promise.all(result);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

main();
