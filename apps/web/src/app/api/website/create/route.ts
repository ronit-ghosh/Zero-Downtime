import { auth } from "@/lib/auth";
import prisma from "@zero-downtime/db/client";
import { createWebsiteValidation } from "@/types/validation/website";
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
    const parsedValues = createWebsiteValidation.safeParse(body);
    if (!parsedValues.success) {
      const err = prettifyError(parsedValues.error);
      return res.json({ err }, { status: 400 });
    }

    const { name, url } = parsedValues.data;

    const existingWebsite = await prisma.website.findFirst({
      where: {
        AND: [{ id: session.user.id }, { url }],
      },
    });

    if (existingWebsite) {
      return res.json({ websiteId: existingWebsite.id });
    }

    const response = await prisma.website.create({
      data: {
        url,
        name,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    if (!response) {
      return res.json(
        { err: "Error while creating website!" },
        { status: 400 },
      );
    }

    return res.json({ websiteId: response.id });
  } catch (error) {
    console.error(error);
    return res.json({ err: "Something went wrong!" }, { status: 500 });
  }
}
