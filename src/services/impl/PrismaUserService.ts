import prisma from "@/lib/prisma";
import { IUserService } from "../interfaces/IUserService";
import { User, Score } from "@prisma/client";

export class PrismaUserService implements IUserService {
  async createUser(data: { email: string; password: string; name?: string }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getTotalUsers(): Promise<number> {
    return prisma.user.count();
  }

  async getUserScores(email: string): Promise<User & { scores: Score[] } | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        scores: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });
    return user;
  }

  async getUsersBestScores(): Promise<{id: string, scores: {points: number}[] }[]> {
    const allUsersBestScores = await prisma.user.findMany({
      select: {
        id: true,
      scores: {
        select: {
          points: true,
        },
        orderBy: {
          points: 'desc',
        },
        take: 1,
      },
      },
    });
    return allUsersBestScores;
  }
} 