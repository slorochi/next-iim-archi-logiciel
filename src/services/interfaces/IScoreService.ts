import { Score, User } from "@prisma/client";

export interface ScoreWithUser extends Score {
  user: User;
}

export interface IScoreService {
  createScore(data: { points: number; userId: string }): Promise<ScoreWithUser>;
  getUserScores(userId: string): Promise<ScoreWithUser[]>;
  getTopScores(limit?: number): Promise<ScoreWithUser[]>;
  getUserBestScore(userId: string): Promise<number>;
  getGlobalHighScore(): Promise<number>;
} 