# CyberEdu KZ

CyberEdu KZ is an MVP web application for cybersecurity learning, adapted for Russian-speaking CIS users and Kazakhstan.

The product idea is inspired by TryHackMe, Hack The Box Academy, PortSwigger Web Security Academy, picoCTF, and OverTheWire, but the MVP scope is intentionally smaller: courses, lessons, practical flag-based tasks, progress, leaderboard, and a simple admin content flow.

## MVP Goal

Build a demo-ready learning platform in 14 days:

- User registration and login
- Course catalog with tracks and difficulty
- Course page with modules, lessons, and challenges
- Server-side flag validation
- User profile with progress and points
- Leaderboard
- Admin content management for courses and challenges
- Russian interface and Kazakhstan/CIS-friendly examples

## Recommended Stack

For a solo two-week MVP:

- Frontend: Next.js or React
- Backend: Node.js API routes or Express/NestJS
- Database: SQLite for local MVP, PostgreSQL for deployment
- ORM: Prisma
- Auth: email/password with hashed passwords and server-side sessions/JWT
- Styling: Tailwind CSS or a compact component library

If time is tight, start with SQLite and migrate to PostgreSQL after the demo.

## Repository Structure

```text
Cyber EDU/
  src/                    # Next.js application source
    app/
    features/
    shared/
  app/                    # Early planning notes for app source
    src/
  docs/                   # Product, Jira, architecture, day plans
  prisma/
    schema.prisma         # Data model for MVP
  deliverables/           # Generated technical spec and Jira CSV
  public/                 # Visual assets, including generated CyberEdu KZ hero image
  scripts/                # Local run, reset, QA, smoke, and lab helper scripts
  server.js               # Current dependency-light Node/SQLite MVP
  tools/                  # Local artifact generation scripts
```

## Day 1 Output

- Product scope fixed in `docs/day-01-kickoff.md`
- Jira workflow and import notes in `docs/jira-setup.md`
- Architecture decisions in `docs/architecture.md`
- Database schema draft in `prisma/schema.prisma`
- Environment template in `.env.example`

## Run Current MVP

The current working MVP does not require npm packages. It runs on the bundled Node.js runtime and uses SQLite via `node:sqlite`.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```

Alternative:

```text
scripts\start-local.bat
```

Then open:

```text
http://localhost:3000
```

Run smoke test while the server is running:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1
```

Start server and run QA in one command:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\qa-local.ps1
```

Reset demo users and submissions before a clean presentation:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-demo-data.ps1
```

Demo flags:

- `CYB{hidden_file_found}`
- `CYB{port_80_http}`
- `CYB{sqli_basics}`
- `CYB{reflected_xss}`
- `CYB{brute_force_alert}`
- `CYB{incident_timeline}`
- `CYB{scope_checked}`
- `CYB{report_the_finding}`
- `CYB{metadata_author}`
- `CYB{timeline_ordered}`
- `CYB{secret_asset_mapped}`
- `CYB{clean_logs_no_secrets}`

Admin account:

```text
admin@cyberedukz.local
Admin12345
```

Admin panel:

```text
http://localhost:3000/admin
```

## MVP Demo Journey

1. A visitor registers an account.
2. The user opens the course catalog.
3. The user starts a beginner Web Security course.
4. The user reads a lesson and submits a flag.
5. The system validates the flag on the server.
6. The user sees updated progress, points, and leaderboard position.

## Current Status

See `docs/current-mvp-status.md` for the latest implemented flow and Jira task status.

Presentation checklist:

```text
docs/final-presentation-checklist.md
```

Final MVP report:

```text
docs/final-project-report.md
```

Docker/WSL lab setup:

```text
docs/docker-wsl-setup.md
```
