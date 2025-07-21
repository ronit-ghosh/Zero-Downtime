import { auth } from "@/lib/auth";
import { deleteWebsiteValidation } from "@/types/validation/website";
import prisma from "@zero-downtime/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse as res } from "next/server";
import { prettifyError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return res.json({ err: "Login first!" }, { status: 401 });
    }

    const body = await req.json();
    const parsedValues = deleteWebsiteValidation.safeParse(body);
    if (!parsedValues.success) {
      const err = prettifyError(parsedValues.error);
      return res.json({ err }, { status: 400 });
    }

    const { websiteId } = parsedValues.data;

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
