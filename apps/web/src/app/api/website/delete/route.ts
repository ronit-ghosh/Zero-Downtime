import { auth } from "@/lib/auth";
import prisma from "@zero-downtime/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get("id");

    if (!websiteId) {
      return res.json({ err: "Param `id` is not present!" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return res.json({ err: "Login first!" }, { status: 401 });
    }

    const response = await prisma.website.delete({
      where: { id: websiteId },
      select: {
        id: true,
        url: true,
        websiteTicks: true,
      },
    });

    if (!response) {
      return res.json(
        { err: "Error while deleting website!" },
        { status: 400 },
      );
    }

    return res.json({
      websiteUrl: response.url,
      msg: response.url + "deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({ err: "Something went wrong!" }, { status: 500 });
  }
}
