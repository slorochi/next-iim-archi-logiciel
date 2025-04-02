"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, Activity, Target, Medal, Gamepad2 } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
interface UserStats {
  totalScore: number;
  bestScore: number;
  gamesPlayed: number;
  rank: string;
  recentScores: Array<{
    id: string;
    points: number;
    createdAt: string;
  }>;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);

  console.log(session);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user) return;
      try {
        const response = await fetch("/api/user/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        console.log(data);
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-400">
      <NavBar session={session} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center text-white mb-8">Dashboard</h1>
        <div className="flex justify-center mb-8">
          <Button className="bg-primary text-white border-2 hover:bg-gray-900 cursor-pointer px-20 py-2 rounded-md" onClick={() => router.push("/play")}>Jouer</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Score Total */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Score Total</CardTitle>
              <CardDescription className="text-xs text-gray-400">Votre score cumulé</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-white">{stats?.totalScore || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Meilleur Score */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Meilleur Score</CardTitle>
              <CardDescription className="text-xs text-gray-400">Votre record personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-white">{stats?.bestScore || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Parties Jouées */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Parties Jouées</CardTitle>
              <CardDescription className="text-xs text-gray-400">Nombre de parties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-white">{stats?.gamesPlayed || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Classement */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Classement</CardTitle>
              <CardDescription className="text-xs text-gray-400">Votre position globale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-white">#{stats?.rank || "-"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Derniers Scores */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Derniers Scores</CardTitle>
            <CardDescription className="text-xs text-gray-400">Vos performances récentes</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentScores && stats.recentScores.length > 0 ? (
              <div className="space-y-4">
                {stats.recentScores.map((score, index) => (
                  <div key={score.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Gamepad2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Partie #{stats.recentScores.length - index}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(score.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{score.points} points</span>
                      {index === 0 && (
                        <span className="text-xs px-2 text-white py-1 bg-primary/10 text-primary rounded-full">
                          Dernier
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun score enregistré</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}