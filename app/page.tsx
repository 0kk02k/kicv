import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Dein Portfolio, <span className="text-blue-600">mit KI-Antrieb.</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-10">
        Erstelle in Minuten eine interaktive Bewerbungsseite. Ein KI-Agent beantwortet Fragen zu deinem Lebenslauf und Projekten – 24/7.
      </p>

      <div className="flex gap-4">
        {!userId ? (
          <>
            <SignUpButton mode="modal">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity">
                Jetzt kostenlos starten
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity">
                Login
              </button>
            </SignInButton>
          </>
        ) : (
          <Link href="/dashboard" className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity">
            Zum Dashboard
          </Link>
        )}
      </div>

      <div className="mt-20 w-full max-w-5xl border rounded-2xl shadow-2xl overflow-hidden bg-card">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <p className="text-muted-foreground font-medium">[Demo Video / Screenshot Platzhalter]</p>
        </div>
      </div>
    </main>
  );
}
