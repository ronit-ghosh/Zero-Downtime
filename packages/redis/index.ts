import { createClient } from "redis";
import { config } from "dotenv";
config({ path: "../../.env", quiet: true });

const client = await createClient({ url: process.env.REDIS_URL })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

interface WebsiteDetails {
  id: string;
  url: string;
}

const STREAM_NAME = "zero-downtime:website";
const WORKER_NAME = "india";

await client
  .xGroupCreate(STREAM_NAME, WORKER_NAME, "$", {
    MKSTREAM: true,
  })
  .catch(() => {});

async function xAdd(payload: WebsiteDetails): Promise<string | Error> {
  try {
    const respone = await client.xAdd(STREAM_NAME, "*", {
      id: payload.id,
      url: payload.url,
    });
    return respone;
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}

export async function xAddBulk(payloads: WebsiteDetails[]): Promise<{
  results: string[];
  errors: Error[];
}> {
  const results: string[] = [];
  const errors: Error[] = [];

  for (const payload of payloads) {
    try {
      const response = await xAdd({ id: payload.id, url: payload.url });
      if (response instanceof Error) {
        errors.push(response);
      } else {
        results.push(response);
      }
    } catch (error) {
      errors.push(error as Error);
    }
  }

  return { results, errors };
}

export async function xReadGroup(
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

export async function xAck(
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

export async function xAckBulk(consumerGroup: string, streamIds: string[]) {
  try {
    const promises = streamIds.map((id) => xAck(consumerGroup, id));
    return await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
}
