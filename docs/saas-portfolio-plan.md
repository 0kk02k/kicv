# Interactive AI Portfolio Service - Plattform Plan (Neon & Vercel)

Dieses Dokument beschreibt die Architektur und Roadmap für einen **Web-KI-Service (SaaS)**. Die Plattform ermöglicht es Nutzern (z.B. Entwicklern, Designern, Freelancern), in kürzester Zeit hochmoderne, interaktive Bewerbungsseiten mit einem integrierten, personalisierten KI-Agenten zu generieren.

## 1. Die Vision & Core Features

Weg von statischen Baukästen hin zu **"AI-first Career Twins"**. Die Plattform fungiert als Generator für Portfolios, die durch RAG (Retrieval-Augmented Generation) gesteuert werden. Besucher (z.B. Recruiter) können direkt mit der Seite interagieren und gezielte Fragen zum Profil stellen.

### Plattform-Features (Für den Nutzer)
*   **Automatisches Onboarding:** Upload eines PDF-Lebenslaufs oder Import via LinkedIn/GitHub. Eine zentrale KI strukturiert die Daten automatisch für die Vektordatenbank.
*   **Individuelle Gestaltung:** Ein Theme-Editor ermöglicht die Anpassung von Farben, Typografie und Layout-Varianten (z.B. Bento Grid vs. Minimalist List), damit jedes Portfolio einzigartig wirkt.
*   **Analytics-Dashboard:** Einblicke in die Interaktionen der Besucher (z.B. "Welche Fragen wurden meinem KI-Agenten am häufigsten gestellt?").
*   **Custom Domains / Subdomains:** Portfolios sind über dynamische Subdomains (z.B. `name.ai-portfolio.com`) erreichbar.

### Portfolio-Features (Für den Besucher/Recruiter)
*   **AI Career Twin:** Ein dedizierter Chat-Agent pro Nutzer, der basierend auf dessen spezifischen Daten (Lebenslauf, Projekte) antwortet.
*   **UI-Triggering:** Der Agent kann die Benutzeroberfläche steuern (z.B. auf die Frage "Welche React-Projekte hast du?" hebt die KI die entsprechenden Kacheln visuell hervor).

---

## 2. Technischer Stack (SaaS Architektur)

| Komponente | Technologie | Zweck |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Fullstack-Framework, Middleware für Subdomains (Tenant-Routing). |
| **Styling & UI** | **Tailwind CSS & Shadcn/UI** | Basis für das generierte Layout und das Dashboard. |
| **Animationen** | **Framer Motion** | Interaktives Feedback und Übergänge. |
| **Datenbank** | **Neon (PostgreSQL)** | Serverless Postgres für relationale Daten und Vektoren (pgvector). |
| **ORM** | **Drizzle ORM** | Type-safe Database Access, optimiert für Edge/Serverless. |
| **Auth** | **Clerk / Kinde** | Schnelle SaaS-Authentifizierung. |
| **KI-Integration** | **Vercel AI SDK** | Orchestrierung der Chatbots und Streaming der Antworten (OpenAI/Gemini). |
| **Document Parsing**| **LlamaParse / LangChain**| Zuverlässige Extraktion von Text und Struktur aus PDF-Uploads. |
| **Deployment** | **Vercel** | Optimiert für Next.js und Edge-Funktionen. |

---

## 3. Datenmodell (Mandantenfähig)

Eine vereinfachte Darstellung der Datenbank-Architektur (via Drizzle ORM):

*   **Users:** Authentifizierung und Basis-Profileinstellungen (Auth-ID vom Auth-Provider, Email).
*   **Portfolios:** Die Konfiguration der generierten Seite (User-ID, Subdomain, Theme-Farben, Layout-Präferenz, Meta-Daten).
*   **Documents (Knowledge Base):** Die Rohdaten (Textblöcke aus CVs/Projekten) verknüpft mit User-ID.
*   **Embeddings:** Die Vektor-Repräsentation der Documents für RAG (via `pgvector` in Neon).
*   **Chat Logs (Analytics):** Gespeicherte (anonymisierte) Konversationen zur Darstellung im Analytics-Dashboard des Nutzers.

---

## 4. Implementierungs-Roadmap

### Phase 1: Plattform-Fundament & Dashboard
- [ ] Next.js Setup mit Neon & Drizzle ORM.
- [ ] Integration eines Auth-Providers (Clerk oder Kinde).
- [ ] Erstellung des User-Dashboards (Login, Profil-Verwaltung).
- [ ] Datenbankschema für `Users`, `Portfolios` und einfache Theme-Einstellungen anlegen.

### Phase 2: AI Data Pipeline (Onboarding)
- [ ] Upload-Funktion für PDF-Lebensläufe implementieren.
- [ ] Integration einer Parsing-Lösung (Text-Extraktion).
- [ ] Text-Chunking und Erstellung von Embeddings, Speicherung in Neon (`pgvector`).

### Phase 3: Dynamic Portfolio Viewer & Theming
- [ ] Next.js Middleware konfigurieren, um Requests basierend auf der Subdomain auf das richtige Portfolio-Profil zu routen.
- [ ] Dynamische Rendering-Engine bauen, die das Layout basierend auf den Einstellungen (Theme, Farben) des Nutzers aufbaut.
- [ ] Integration des Vercel AI SDK im Portfolio-Viewer, angebunden an den mandantenspezifischen RAG-Kontext.
- [ ] Implementierung der "Tools" für den Chatbot (z.B. `highlightProject`), um die UI zu steuern.

### Phase 4: Analytics & Launch
- [ ] Speicherung von Chat-Metadaten.
- [ ] Auswertung und Visualisierung der Chat-Daten im User-Dashboard (z.B. Recharts).
- [ ] Finales Polishing und Vercel Deployment.
