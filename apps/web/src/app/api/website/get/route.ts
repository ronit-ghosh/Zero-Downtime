import { auth } from "@/lib/auth";
import prisma from "@zero-downtime/db/client";
import { headers } from "next/headers";
import { NextResponse as res } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return res.json({ err: "Login first!" }, { status: 401 });
    }

    const response = await prisma.website.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        url: true,
        websiteTicks: {
          select: {
            responseTimeMs: true,
            statusCode: true,
            errorCode: true,
            updatedAt: true,
          },
          take: 1,
        },
      },
    });

    if (!response) {
      return res.json({ err: "Error while fetching websites!" });
    }

    return res.json({
      websites: response.map((w) => {
        if (w.websiteTicks.length === 0) {
          return {
            websiteId: w.id,
            name: w.name,
            url: w.url,
          };
        }
        return {
          websiteId: w.id,
          name: w.name,
          url: w.url,
          responseMs: w.websiteTicks[0].responseTimeMs,
          errorCode: w.websiteTicks[0].errorCode,
          statusCode: w.websiteTicks[0].statusCode,
          lastChecked: w.websiteTicks[0].updatedAt,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return res.json({ err: "Something went wrong!" }, { status: 500 });
  }
}
