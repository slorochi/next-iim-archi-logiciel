"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Mail } from "lucide-react";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (isSignUp) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Une erreur est survenue");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <Tabs defaultValue="signin" className="w-full text-gray-300 bg-gray-700">
      <TabsList className="grid bg-gray-700 w-full grid-cols-2">
        <TabsTrigger className="text-gray-200 hover:bg-gray-800 rounded-none cursor-pointer aria-selected:bg-gray-800" value="signin" onClick={() => setIsSignUp(false)}>Connexion</TabsTrigger>
        <TabsTrigger className="text-gray-200 hover:bg-gray-800 rounded-none cursor-pointer aria-selected:bg-gray-800" value="signup" onClick={() => setIsSignUp(true)}>Inscription</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={handleSubmit}>
          <Card className="border-none rounded-lg p-4">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full border-gray-300 border-2 cursor-pointer hover:bg-gray-800" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
              <div className="relative w-full">
  
                <div className="relative flex justify-center items-center text-xs uppercase">
                  <hr className="w-20  border-gray-300" />
                  <span className="px-2 text-gray-200">
                    Ou continuer avec
                  </span>
                  <hr className="w-20  border-gray-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleProviderSignIn("google")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleProviderSignIn("github")}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={handleSubmit}>
          <Card className="border-none rounded-lg p-4">
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full border-gray-300 border-2 cursor-pointer hover:bg-gray-800" disabled={isLoading}>
                {isLoading ? "Inscription..." : "S'inscrire"}
              </Button>
              <div className="relative w-full">
  
                <div className="relative flex justify-center items-center text-xs uppercase">
                  <hr className="w-20  border-gray-300" />
                  <span className="px-2 text-gray-200">
                    Ou continuer avec
                  </span>
                  <hr className="w-20  border-gray-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600 cursor-pointer"
                  onClick={() => handleProviderSignIn("google")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600 cursor-pointer"
                  onClick={() => handleProviderSignIn("github")}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
    </Tabs>
  );
} 