import { Score, User } from "@prisma/client";

export interface IUserService {
  createUser(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getTotalUsers(): Promise<number>;
  getUserScores(email: string): Promise<User & { scores: Score[] } | null>;
  getUsersBestScores(): Promise<User & { scores: Score[] }[]>;
}
