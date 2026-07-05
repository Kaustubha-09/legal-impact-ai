# LifeLaw

A responsive web-first MVP for a personalized legal intelligence platform for everyday people.

This is not positioned as a law firm, attorney replacement, or legal advice product.

## Stack

- Frontend: Next.js 15, TypeScript, TailwindCSS, shadcn-style components, React Query
- Backend: FastAPI, Python, SQLAlchemy
- Database target: PostgreSQL with pgvector
- Auth target: Clerk
- Local impact engine: profile-aware, rules-based legal education
- Optional free source targets: Congress.gov, GovInfo, CourtListener, Federal Register, and the U.S. Census geocoder

## Run Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Local-First Q&A

The Q&A, profile, saved items, rights library, watchlists, and search index run locally in the browser. No paid AI key is required. The optional current-location control uses the free U.S. Census geocoder only after the user requests it; precise coordinates are not stored.

## Run Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## MVP Surface

- Onboarding with state, city, county, and profile tags
- Personalized legal feed with rights, responsibilities, impact, and citations
- Structured legal Q&A response shape with required educational disclaimer
- Rights library
- Legal search surface with filters and AI source-summary area
- Court ruling summary surface
- Saved items, watchlists, and weekly "What changed for me?" alerts
