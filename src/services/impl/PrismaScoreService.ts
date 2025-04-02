import prisma from "@/lib/prisma";
import { IScoreService, ScoreWithUser } from "../interfaces/IScoreService";

export class PrismaScoreService implements IScoreService {
  async createScore(data: { points: number; userId: string }): Promise<ScoreWithUser> {
    return prisma.score.create({
      data: {
        points: data.points,
        userId: data.userId,
      },
      include: {
        user: true,
      },
    });
  }

  async getUsersBestScore(): Promise<ScoreWithUser[]> {
    return prisma.score.findMany({
      orderBy: {
        points: "desc",
      },
      include: {
        user: true,
      },
    });
  }

  async getUserScores(userId: string): Promise<ScoreWithUser[]> {
    return prisma.score.findMany({
      where: { userId },
      orderBy: {
        points: "desc",
      },
      include: {
        user: true,
      },
    });
  }

  async getTopScores(limit = 10): Promise<ScoreWithUser[]> {
    return prisma.score.findMany({
      take: limit,
      orderBy: {
        points: "desc",
      },
      include: {
        user: true,
      },
    });
  }

  async getUserBestScore(userId: string): Promise<number> {
    const bestScore = await prisma.score.findFirst({
      where: { userId },
      orderBy: {
        points: "desc",
      },
    });
    return bestScore?.points || 0;
  }

  async getGlobalHighScore(): Promise<number> {
    const highScore = await prisma.score.findFirst({
      orderBy: {
        points: "desc",
      },
    });
    return highScore?.points || 0;
  }
} 