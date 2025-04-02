import { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Connexion - Next Game App",
  description: "Connectez-vous ou créez un compte pour accéder à l'application",
};

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full h-screen bg-gray-800 text-gray-100 mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Bienvenue sur Cells</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
} 