import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaGameService } from "@/services";
import { PrismaUserService } from "@/services";

const gameService = new PrismaGameService();
const userService = new PrismaUserService();

export async function GET() {
  try {
    const session = await getServerSession();
    let userId: string | undefined;

    if (session?.user?.email) {
      const user = await userService.getUserByEmail(session.user.email);
      userId = user?.id;
    }

    const stats = await gameService.getGameStats(userId);

    return NextResponse.json({
      totalPlayers: stats.totalPlayers,
      highScore: stats.highScore,
      yourBestScore: stats.userBestScore,
      speciesDiscovered: 42, // Cette valeur pourrait être déplacée dans le service si nécessaire
    });
  } catch (error) {
    console.error("Error fetching game stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch game statistics" },
      { status: 500 }
    );
  }
} 