import { switchWebsiteValidation } from "@/types/validation/website";
import prisma from "@zero-downtime/db/client";
import { NextRequest, NextResponse as res } from "next/server";
import { prettifyError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedValues = switchWebsiteValidation.safeParse(body);
    if (!parsedValues.success) {
      const err = prettifyError(parsedValues.error);
      return res.json({ err }, { status: 400 });
    }

    const { websiteId, isTracking } = parsedValues.data;

    const response = await prisma.website.update({
      where: { id: websiteId },
      data: { isTracking },
    });

    if (!response) {
      return res.json(
        { err: "Error while switching off website tracking!" },
        { status: 400 },
      );
    }

    return res.json({ websiteId: response.id });
  } catch (error) {
    console.error(error);
    return res.json({ msg: "Something went wrong! " }, { status: 500 });
  }
}
