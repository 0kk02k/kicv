import os

# Content for the Markdown file
markdown_content = """# Interactive AI Portfolio - Projektplan

Dieses Dokument beschreibt die Vision, den Tech-Stack und die Roadmap für ein hochmodernes Entwickler-Portfolio, das über eine einfache Linksammlung hinausgeht und einen interaktiven KI-Agenten nutzt.

## 1. Die Vision
Weg von einer statischen "Linktree"-Lösung hin zu einer **"Interactive Agent Experience"**. Die Website dient als "Gesellenstück", das moderne Webtechnologien und KI-Integration (RAG) demonstriert.

### Key Features
* **Bento Grid Layout:** Ein modulares, responsives Raster zur Visualisierung von Skills und Top-Projekten.
* **AI Career Twin (Chatbot):** Ein integriertes Chat-Interface, das Fragen zum Lebenslauf und zu Code-Projekten beantwortet.
* **UI-Triggering:** Die KI kann nicht nur texten, sondern die UI steuern (z. B. "Zeig mir das Projekt X" -> Die KI hebt die entsprechende Kachel hervor).
* **Case Studies:** Detaillierte Darstellung von Problemlösungen statt nur Code-Links.

---

## 2. Technischer Stack (State of the Art)

| Komponente | Technologie | Zweck |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Performance, SSR & API Routes für den Chat. |
| **Styling** | **Tailwind CSS** | Schnelles Utility-First Design. |
| **Animationen** | **Framer Motion** | Flüssige Übergänge und UI-Feedback durch die KI. |
| **KI-Integration** | **Vercel AI SDK** | Streaming von LLM-Antworten (Gemini/OpenAI). |
| **Datenbank/Vektor**| **Supabase (pgvector)** | Speicherung von CV-Embeddings für RAG. |
| **Deployment** | **Vercel** | Nahtlose CI/CD Integration. |

---

## 3. Datenstruktur für den KI-Agenten
Um dem Agenten "Wissen" zu geben, werden folgende Datenquellen genutzt:
1.  **CV_DATA.md:** Strukturierter Lebenslauf (Erfahrung, Tech-Stack, Ausbildung).
2.  **PROJECTS_DATA.json:** Metadaten zu Projekten (Herausforderungen, genutzte Libs, Links).
3.  **GITHUB_READMEs:** Deep-Dive Informationen direkt aus den Repositories.

---

## 4. Implementierungs-Roadmap

### Phase 1: Fundament (Scaffolding)
- [ ] Next.js Projekt initialisieren (`npx create-next-app@latest`).
- [ ] Grundlegendes Bento-Grid Layout mit Tailwind erstellen.
- [ ] Dark-Mode-First Design-System festlegen.

### Phase 2: Die Wissensdatenbank (RAG)
- [ ] Erstellen der Markdown-Dateien für den Lebenslauf.
- [ ] Setup von Supabase und Einpflegen der Daten als Vektoren (oder einfacher: System-Prompt Inject für kleine Datenmengen).

### Phase 3: AI Chat Interface
- [ ] Chat-Komponente (Floating Bubble oder Sidepanel) entwickeln.
- [ ] Integration des Vercel AI SDK.
- [ ] Programmierung der "Tools": Die KI erhält Funktionen, um das Interface zu manipulieren (z. B. `highlightProject(id)`).

### Phase 4: Content & Polishing
- [ ] Befüllen der Projekt-Kacheln mit Mockups/GIFs.
- [ ] Deployment auf Vercel.

---

## 5. CLI-Befehle für den Start
```bash
# Projekt erstellen
npx create-next-app@latest my-portfolio --typescript --tailwind --eslint

# Zusätzliche Libraries installieren
npm install ai lucide-react framer-motion clsx tailwind-merge