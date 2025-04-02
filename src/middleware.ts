import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Si l'utilisateur n'est pas authentifié, il sera automatiquement redirigé vers la page de connexion
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Spécifier les chemins qui nécessitent une authentification
export const config = {
  matcher: [
    // Routes qui nécessitent une authentification
    "/dashboard/:path*",
    "/profile/:path*",
    "/game/:path*",
    // Exclure les routes d'authentification et les ressources statiques
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
}; 