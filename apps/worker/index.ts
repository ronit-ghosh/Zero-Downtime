import prisma from "@zero-downtime/db/client";
import { xAck, xReadGroup } from "@zero-downtime/redis/client";
import { xAddDb } from "@zero-downtime/redis/db-pusher";
import axios from "axios";
import { config } from "dotenv";
import { Resend } from "resend";

config({ path: "../../.env", quiet: true });
const RESEND_API_KEY = process.env.RESEND_API_KEY as string;
const RESEND_EMAIL = process.env.RESEND_EMAIL as string;
const REGION_ID = process.env.REGION_ID as string;
const WORKER_ID = process.env.WORKER_ID as string;
const resend = new Resend(RESEND_API_KEY);

interface Website {
  id: string;
  url: string;
  statusCode?: number;
  responseMs?: number;
}

async function notifyUser(website: Website) {
  try {
    if (!RESEND_API_KEY || !RESEND_EMAIL) {
      throw new Error("`RESEND_API_KEY` `RESEND_EMAIL` is not present in .env");
    }
    const websiteDetails = await prisma.website.findFirst({
      where: {
        id: website.id,
      },
      select: {
        websiteTicks: true,
        user: {
          select: {
            email: true,
            name: true
          },
        },
      },
    });
    if (!websiteDetails) {
      console.error("Website not found", website.id, website.url);
      return;
    }
    const { data, error } = await resend.emails.send({
      from: RESEND_EMAIL,
      to: websiteDetails.user.email,
      subject: "Your Website is Down!",
      html: `<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Hi <strong>${websiteDetails.user.name}</strong>,</p>

    <p>We noticed your website <a href="${website.url}">${website.url}</a> is currently <strong>down</strong>.</p>

    <ul>
      <li><strong>Status Code:</strong> ${website.statusCode}</li>
      <li><strong>Response Time:</strong> ${website.responseMs} ms</li>
      <li><strong>Last Checked:</strong>${Date.now().toLocaleString()}</li>
    </ul>

    <p>Please check your website or contact your hosting provider.</p>

    <p>Zero Downtime - Support Team</p>
  </body>
</html>`,
    });
    if (error) {
      console.error(error);
      return error;
    }    
    console.log("[worker]: resend response: ", data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
      console.error(
        `${website.url} returned `,
        error.code,
        error.response?.status
      );
      if (error.response?.status)
        return {
          statusCode: error.response.status,
        };
      return {
        statusCode: 0
      };
    } else {
      console.error("Non-Axios error:", error);
      return {
        statusCode: 0
      };
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
        await notifyUser(data);
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
