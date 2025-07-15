// TODO:
import { auth } from "@/lib/auth";
import prisma from "@zero-downtime/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return res.json({ msg: "Not implemented yet!" }, { status: 411 });
  } catch (error) {
    console.error(error);
    return res.json({ msg: "Something went wrong! " }, { status: 500 });
  }
}
