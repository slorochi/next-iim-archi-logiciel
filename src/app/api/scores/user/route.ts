import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaScoreService } from "@/services/impl/PrismaScoreService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const scores = await PrismaScoreService.getUserScores(session.user.id);
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Failed to fetch user scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch user scores" },
      { status: 500 }
    );
  }
} 