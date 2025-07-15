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
        url: true,
        websiteTicks: true,
      },
    });

    if (!response) {
      return res.json({ err: "Error while fetching websites!" });
    }

    return res.json({
      websites: response.map((w) => {
        return {
          websiteId: w.id,
          websiteUrl: w.url,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return res.json({ err: "Something went wrong!" }, { status: 500 });
  }
}
