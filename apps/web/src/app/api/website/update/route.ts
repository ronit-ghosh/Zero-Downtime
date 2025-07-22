import { auth } from "@/lib/auth";
import { updateWebsiteValidation } from "@/types/validation/website";
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
      return res.json({ msg: "Login first!" }, { status: 401 });
    }

    const body = await req.json();
    const parsedValues = updateWebsiteValidation.safeParse(body);
    if (!parsedValues.success) {
      const err = prettifyError(parsedValues.error);
      return res.json({ err }, { status: 400 });
    }

    const { name, url, websiteId } = parsedValues.data;

    const response = await prisma.website.update({
      where: {
        id: websiteId
      },
      data: {
        url,
        name
      },
    });

    if (!response) {
      return res.json(
        { err: "Error while updating website!" },
        { status: 400 },
      );
    }

    return res.json({ websiteId: response.id });
  } catch (error) {
    console.error(error);
    return res.json({ msg: "Something went wrong! " }, { status: 500 });
  }
}
