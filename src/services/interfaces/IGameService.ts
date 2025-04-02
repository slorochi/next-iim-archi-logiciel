import { Score } from "@prisma/client";

export interface GameStats {
  totalPlayers: number;
  highScore: number;
  userBestScore: number;
}

export interface IGameService {
  getGameStats(userId?: string): Promise<GameStats>;
  submitScore(userId: string, points: number): Promise<Score>;
} 