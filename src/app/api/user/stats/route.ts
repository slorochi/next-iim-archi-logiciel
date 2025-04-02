import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { PrismaUserService } from "@/services";

const userService = new PrismaUserService();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    // Récupérer l'utilisateur et ses statistiques
    const user = await userService.getUserScores(session.user.email);

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    // Calculer les statistiques
    const totalScore = user.scores.reduce((acc: number, score) => acc + score.points, 0);
    const bestScore = Math.max(...user.scores.map(score => score.points), 0);
    const gamesPlayed = user.scores.length;

    // Calculer le classement
    const allUsersBestScores = await userService.getUsersBestScores();
    // Créer un tableau des meilleurs scores avec les IDs des utilisateurs
    const bestScores = allUsersBestScores
      .map(user => ({
        userId: user.id,
        bestScore: user.scores[0]?.points || 0
      }))
      .sort((a, b) => b.bestScore - a.bestScore);

    // Trouver la position de l'utilisateur actuel
    const userRank = bestScores.findIndex(score => score.userId === user.id) + 1;
    const rank = userRank > 0 ? userRank.toString() : "-";

    return NextResponse.json({
      totalScore,
      bestScore,
      gamesPlayed,
      rank,
      recentScores: user.scores.length > 0 ? user.scores.map(score => ({
        id: score.id,
        points: score.points,
        createdAt: score.createdAt.toISOString()
      })) : [],
    });
  } catch (error) {
    console.error("[USER_STATS]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}  