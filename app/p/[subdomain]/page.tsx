import { db } from "@/db";
import { portfolios, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AIChat } from "@/components/ai-chat";

export default async function PortfolioPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.subdomain, subdomain),
    with: {
      user: true,
    }
  });

  if (!portfolio) {
    notFound();
  }

  const userProjects = await db.query.projects.findMany({
    where: eq(projects.portfolioId, portfolio.id),
  });

  const { id: portfolioId, themeConfig, user } = portfolio;
  const typedThemeConfig = themeConfig as { primaryColor: string, layout: string, fontFamily: string };

  const userName = user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: typedThemeConfig.fontFamily }}>
      <header className="p-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">{userName}</h1>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#about" className="hover:text-blue-600">Über mich</a>
          <a href="#projects" className="hover:text-blue-600">Projekte</a>
          <a href="#contact" className="hover:text-blue-600">Kontakt</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-10">
        <section className="py-20 text-center">
          <h2 className="text-5xl font-extrabold mb-6">Hallo, ich bin {userName}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ich bin ein Fullstack-Entwickler, der leidenschaftlich gerne skalierbare Anwendungen baut. 
            Frage meinen KI-Agenten alles über meine Erfahrung!
          </p>
        </section>

        {/* Bento Grid Layout */}
        <section id="projects" className="py-20">
          <h3 className="text-3xl font-bold mb-10">Top Projekte</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userProjects.length > 0 ? (
              userProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`${index % 3 === 0 ? 'md:col-span-2' : ''} h-64 bg-gray-100 rounded-3xl border p-8 flex flex-col justify-end transition-all hover:shadow-lg`}
                  style={index % 2 === 1 ? { backgroundColor: typedThemeConfig.primaryColor, color: 'white' } : {}}
                >
                  <h4 className="text-2xl font-bold">{project.title}</h4>
                  <p className={index % 2 === 1 ? 'text-white/80' : 'text-gray-600'}>
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {(project.tags as string[]).slice(0, 3).map(tag => (
                      <span key={tag} className={`text-xs px-2 py-1 rounded-full ${index % 2 === 1 ? 'bg-white/20' : 'bg-gray-200'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed rounded-3xl">
                Noch keine Projekte hochgeladen. Nutze den CV-Upload im Dashboard!
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="p-10 border-t text-center text-sm text-gray-500">
        Erstellt mit <span className="font-bold">AI Portfolio Service</span>
      </footer>

      <AIChat portfolioId={portfolioId} primaryColor={typedThemeConfig.primaryColor} />
    </div>
  );
}
