import prisma from "@zero-downtime/db/client";
import { xAddBulk } from "@zero-downtime/redis/client";

async function pushWebsitesInStream() {
  try {
    const websites = await prisma.website.findMany({
      where: {
        isTracking: true,
      },
      select: {
        id: true,
        url: true,
      },
    });
    if (websites.length === 0) {
      throw new Error("[pusher]: Empty `websites` table!");
    }
    const response = await xAddBulk(websites);
    console.log(
      "added to the stream: " + response.results.map((r) => r) + "\n"
    );
    if (response.errors.length > 0)
      console.error(response.errors.map((e) => e));
    console.log(`${websites.length} websites pushed to redis stream`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
pushWebsitesInStream();
setInterval(() => {
  pushWebsitesInStream();
}, 3 * 10000);
