import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PrismaScoreService } from "@/services";

const scoreService = new PrismaScoreService();

export async function GET() {
  try {
    const scores = await scoreService.getTopScores();
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const body = await req.json();
    const { points } = body;

    if (!points || typeof points !== "number") {
      return new NextResponse("Score invalide", { status: 400 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    // Créer le score
    const score = await prisma.score.create({
      data: {
        points,
        userId: user.id,
      },
    });

    return NextResponse.json(score);
  } catch (error) {
    console.error("[SCORE_CREATE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
} 