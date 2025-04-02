"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";
import { NavBar } from "@/components/NavBar";

interface Score {
  id: string;
  points: number;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  createdAt: string;
}

export default function Leaderboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores");
        if (!response.ok) throw new Error("Failed to fetch scores");
        const data = await response.json();
        console.log(data);
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topThree = scores.slice(0, 3);
  const otherScores = scores.slice(3, 10);

  return (
    <div className="min-h-screen bg-gray-800">
      <NavBar session={session} />

      <main className="py-8 flex flex-col items-center w-full">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white">Classement global</h2>
          <p className="text-gray-400">
            Les meilleurs joueurs de la semaine
          </p>
        </div>

        <Card className="border-gray-700 w-full max-w-4xl bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Top 3 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2ème place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Medal className="h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-2xl font-bold text-gray-400">2</div>
                    <div className="font-medium text-white">{topThree[1].user.name || topThree[1].user.email}</div>
                    <div className="text-sm text-gray-400">{topThree[1].points} points</div>
                  </div>
                )}

                {/* 1ère place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Crown className="h-12 w-12 text-yellow-500 mb-2" />
                    <div className="text-3xl font-bold text-yellow-500">1</div>
                    <div className="font-medium text-white">{topThree[0].user.name || topThree[0].user.email}</div>
                    <div className="text-sm text-gray-400">{topThree[0].points} points</div>
                  </div>
                )}

                {/* 3ème place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Medal className="h-8 w-8 text-amber-600 mb-2" />
                    <div className="text-2xl font-bold text-amber-600">3</div>
                    <div className="font-medium text-white">{topThree[2].user.name || topThree[2].user.email}</div>
                    <div className="text-sm text-gray-400">{topThree[2].points} points</div>
                  </div>
                )}
              </div>

              {/* Liste des autres joueurs */}
              <div className="space-y-2">
                {otherScores.map((score, index) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-gray-400 w-8">
                        {index + 4}
                      </span>
                      {score.user.image ? (
                        <img
                          src={score.user.image}
                          alt={score.user.name || ""}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-600" />
                      )}
                      <span className="font-medium text-white">
                        {score.user.name || score.user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-white">{score.points} points</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 