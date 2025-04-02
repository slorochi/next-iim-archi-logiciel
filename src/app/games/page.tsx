"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Gamepad2, Info, Trophy, Clock, Users, Sparkles } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { ScoreModal } from "@/components/ScoreModal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function Games() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gameStats, setGameStats] = useState({
    totalPlayers: 0,
    highScore: 0,
    yourBestScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    
    if (status === "authenticated") {
      fetchGameStats();
    }
  }, [status, router]);

  const fetchGameStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/games/stats");
      if (!response.ok) throw new Error("Failed to fetch game stats");
      const data = await response.json();
      console.log(data);
      setGameStats({
        totalPlayers: data.totalPlayers,
        highScore: data.highScore,
        yourBestScore: data.yourBestScore,
      });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Chargement de l'écosystème...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-800 to-gray-900">
      <NavBar session={session} />

      <main className="flex flex-col w-full items-center mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 relative inline-block">
            Game of Life
            <span className="absolute -top-3 -right-6">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Générez des cellules primitives et observez l'évolution des espèces dans votre écosystème virtuel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-3xl">
          <StatCard 
            icon={<Trophy className="h-6 w-6 text-yellow-400" />}
            title="Meilleur score"
            value={gameStats?.highScore?.toLocaleString()}
            color=""
          />
          <StatCard 
            icon={<Users className="h-6 w-6 text-blue-400" />}
            title="Joueurs actifs"
            value={gameStats?.totalPlayers?.toLocaleString()}
            color=""
          />
        </div>

        <Card className="w-full border-gray-700 bg-gray-800/60 backdrop-blur-sm max-w-2xl mx-auto shadow-xl hover:shadow-primary/10 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 shadow-inner shadow-primary/10">
                <Gamepad2 className="h-7 w-7 text-gray-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl text-white">Cells</CardTitle>
                  <Badge variant="outline" className="text-xs bg-gray-200/10 text-gray-200 border-gray-200/20">v beta 0.1</Badge>
                </div>
                <CardDescription className="text-gray-400">
                  Évoluez de la cellule primitive à des espèces complexes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative overflow-hidden rounded-lg h-52 bg-gray-900/60 border border-gray-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-2 p-4 opacity-60">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-12 h-12 rounded-full ${i % 3 === 0 ? 'bg-primary/60' : i % 5 === 0 ? 'bg-purple-500/40' : 'bg-blue-400/40'} 
                      ${i % 7 === 0 ? 'animate-pulse' : ''}`}
                    ></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30">
                  <p className="text-white font-medium">Aperçu du jeu</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900/60 border border-gray-700">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-300">Votre meilleur score:</span>
              </div>
              <span className="text-white font-bold">{gameStats.yourBestScore ||0} points</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="w-full bg-gray-700 hover:bg-gray-700/80 text-white"
                      onClick={() => router.push('/games/cells/tutorial')}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Tutoriel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="bg-gray-700/90 text-gray-200 rounded-lg p-2">Débutez une partie pour comprendre les mécaniques de jeu.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                className="w-full bg-gray-900 hover:bg-gray-900/70 text-white font-medium cursor-pointer"
                onClick={() => router.push('/play')}
              >
                Jouer maintenant
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-700 flex justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Temps moyen: ? min</span>
            </div>
            <div>
              Dernière mise à jour: 28/03/2025
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Des nouvelles espèces sont ajoutées régulièrement. Revenez souvent!</p>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  return (
    <div className={`rounded-lg p-4 border border-gray-700 ${color}`}>
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}