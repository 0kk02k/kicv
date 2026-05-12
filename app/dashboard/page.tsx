import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ThemeEditor } from "@/components/theme-editor";
import { CVUpload } from "@/components/cv-upload";
import { getOrCreateUser } from "@/lib/actions";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";

import { ThemeConfig } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await getOrCreateUser();
  if (!user) {
    redirect("/");
  }

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, user.id),
  });

  const portfolioUrl = portfolio ? `${portfolio.subdomain}.ai-portfolio.com` : 'noch nicht konfiguriert';

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dein KI-Portfolio</h1>
          <p className="text-muted-foreground mt-1">Verwalte deine Seite und trainiere deinen KI-Agenten.</p>
        </div>
        <UserButton />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <CVUpload />
          
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <h2 className="text-xl font-bold mb-4">Live-Vorschau</h2>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border">
              <p className="text-sm text-muted-foreground">Deine Seite ist erreichbar unter: <br />
                <span className="font-mono text-blue-600">{portfolioUrl}</span>
              </p>
            </div>
            <button className="w-full mt-4 border border-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Seite in neuem Tab öffnen
            </button>
          </div>
        </div>

        <div className="space-y-10">
          <ThemeEditor initialConfig={portfolio?.themeConfig as ThemeConfig | undefined} />
          
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <h2 className="text-xl font-bold mb-4">Analytics-Snapshot</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Seitenaufrufe</span>
                <span className="font-bold text-lg">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">KI-Interaktionen</span>
                <span className="font-bold text-lg">0</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-0"></div>
              </div>
              <p className="text-xs text-muted-foreground">Sammle mehr Daten, um Trends zu sehen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
