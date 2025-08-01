import { createClient } from "redis";
import { config } from "dotenv";
config({ path: "../../.env", quiet: true });

const client = await createClient({ url: process.env.REDIS_URL })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

interface WebsiteDetails {
  responseTimeMs: number;
  status: "UP" | "DOWN" | "UNKNOWN";
  statusCode: number;
  errorCode?: string;
  websiteId: string;
}

const STREAM_NAME = "zero-downtime:db-pusher";
const WORKER_NAME = "db-pusher";

await client
  .xGroupCreate(STREAM_NAME, WORKER_NAME, "$", {
    MKSTREAM: true,
  })
  .catch(() => {});

export async function xAddDb(payload: WebsiteDetails): Promise<string | Error> {
  try {
    const respone = await client.xAdd(STREAM_NAME, "*", {
      responseTimeMs: String(payload.responseTimeMs),
      status: String(payload.status),
      statusCode: String(payload.statusCode),
      websiteId: payload.websiteId,
    });
    return respone;
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}

export async function xReadGroupDb(
  consumerGroup: string,
  workerId: string,
  count: number = 5
): Promise<Array<[string, string[]]> | Error> {
  try {
    const response = await client.xReadGroup(
      consumerGroup, // india / usa
      workerId, // india-1, india-2 / usa-1, usa-2
      { key: STREAM_NAME, id: ">" },
      { COUNT: count }
    );
    return response as Array<[string, string[]]>;
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}

export async function xAckDb(
  consumerGroup: string,
  streamId: string
): Promise<number | Error> {
  try {
    const response = await client.xAck(STREAM_NAME, consumerGroup, streamId);
    return response;
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}
