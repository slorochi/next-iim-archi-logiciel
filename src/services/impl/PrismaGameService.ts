import prisma from "@/lib/prisma";
import { IGameService, GameStats } from "../interfaces/IGameService";
import { PrismaScoreService } from "./PrismaScoreService";
import { PrismaUserService } from "./PrismaUserService";
import { Score } from "@prisma/client";

export class PrismaGameService implements IGameService {
  private scoreService: PrismaScoreService;
  private userService: PrismaUserService;

  constructor() {
    this.scoreService = new PrismaScoreService();
    this.userService = new PrismaUserService();
  }

  async getGameStats(userId?: string): Promise<GameStats> {
    const [totalPlayers, highScore, userBestScore] = await Promise.all([
      this.userService.getTotalUsers(),
      this.scoreService.getGlobalHighScore(),
      userId ? this.scoreService.getUserBestScore(userId) : 0,
    ]);

    return {
      totalPlayers,
      highScore,
      userBestScore,
    };
  }

  async submitScore(userId: string, points: number): Promise<Score> {
    return this.scoreService.createScore({ userId, points });
  }
} 