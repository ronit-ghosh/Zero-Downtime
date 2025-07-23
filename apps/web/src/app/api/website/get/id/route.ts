import { auth } from "@/lib/auth";
import prisma from "@zero-downtime/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30");

    if (!websiteId) {
      return res.json({ err: "Param `id` is not present!" }, { status: 400 });
    }

    if (page < 1 || limit < 1 || limit > 100) {
      return res.json({ err: "Invalid pagination parameters!" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return res.json({ err: "Login first!" }, { status: 401 });
    }

    const skip = (page - 1) * limit;

    const response = await prisma.website.findFirst({
      where: {
        AND: [{ userId: session.user.id }, { id: websiteId }],
      },
      select: {
        id: true,
        name: true,
        url: true,
        isTracking: true,
        websiteTicks: {
          select: {
            responseTimeMs: true,
            errorCode: true,
            statusCode: true,
            updatedAt: true,
          },
          take: limit,
          skip: skip,
          orderBy: {
            updatedAt: 'desc'
          }
        },
        _count: {
          select: {
            websiteTicks: true
          }
        }
      },
    });

    if (!response) {
      return res.json(
        { err: "Error while fetching website!" },
        { status: 400 },
      );
    }

    const totalTicks = response._count.websiteTicks;
    const totalPages = Math.ceil(totalTicks / limit);

    return res.json({
      website: {
        id: response.id,
        name: response.name,
        url: response.url,
        isTracking: response.isTracking,
        websiteTicks: response.websiteTicks,
      },
      pagination: {
        page,
        limit,
        totalTicks,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    return res.json({ err: "Something went wrong!" }, { status: 500 });
  }
}
