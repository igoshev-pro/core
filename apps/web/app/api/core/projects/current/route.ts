import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const h = await headers();
  const projectId = h.get("x-project-id");

  if (!projectId) {
    return NextResponse.json(
      { message: "x-project-id header is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({ projectId });
}

