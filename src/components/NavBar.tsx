import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavBarProps {
  session?: any;
}

export function NavBar({ session }: NavBarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-700 bg-gray-800 flex w-full h-14">
      <div className="w-full px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">v beta 0.1</Badge>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-white">
                  Cells
                </h1>
              </div>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/dashboard")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
              >
                Dashboard
              </Link>
              
              <Link
                href="/play"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/play")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
              >
                Play
              </Link>
              <Link
                href="/games"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/games")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
              >
                Games
              </Link>
              <Link
                href="/leaderboard"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/leaderboard")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
              >
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session?.user?.image ? (
            <div className="flex items-center gap-2 mr-2">
              <img
                src={session.user.image}
                alt="Profile"
                className="h-6 w-6 rounded-full"
              />
            </div>
          ) : (
            <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <svg className="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
          )}
          <span className="text-sm font-medium text-gray-300 hidden md:inline">
            {session?.user?.name || "Utilisateur"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-gray-300 hover:text-white cursor-pointer"
          >
            Déconnexion
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
} 