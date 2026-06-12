# CyberEdu KZ Final MVP Report

## Project Summary

CyberEdu KZ is a working MVP of a cybersecurity learning web application adapted for Russian-speaking CIS users and Kazakhstan.

The MVP demonstrates the core learning loop:

1. Register or log in.
2. Browse courses.
3. Open a lesson.
4. Read theory.
5. Solve a practical challenge.
6. Submit a flag.
7. Receive points.
8. Track progress.
9. Compare results on the leaderboard.

## Implemented Features

- Local web server without external npm dependencies.
- SQLite database through bundled Node.js `node:sqlite`.
- User registration, login, logout, and profile.
- Course catalog.
- Course pages with ordered lessons.
- Lesson pages with theory and practice.
- Challenge workspace with flag submission.
- Server-side flag validation.
- Submission history and solved status.
- Points and course progress.
- Leaderboard.
- Roadmap page.
- Labs planning page.
- Lab catalog manifests.
- Dockerfile template for a safe Linux lab.
- Admin panel.
- Admin course creation and editing.
- Admin lesson creation and editing.
- Admin challenge creation and editing.
- Demo content: 5 courses, 10 lessons, 10 challenges.
- Smoke-test script.
- Demo reset script.
- Technical specification and Jira backlog files.
- Git, Node.js/npm, and Docker Desktop installed through winget.

## Security Notes

- Passwords are stored as hashes.
- Flags are validated on the server.
- Submitted flags are stored as hashes, not raw values.
- Admin routes require an admin role.
- Training tasks are safe and do not target real infrastructure.

## Run

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```

Open:

```text
http://localhost:3000
```

## Test

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1
```

Expected output:

```text
Smoke test passed
```

## Demo Admin

```text
admin@cyberedukz.local
Admin12345
```

## MVP Limitations

- Uses local SQLite storage for the MVP.
- npm and git are now installed. The demo server still intentionally runs without external npm runtime dependencies.
- Docker Desktop is installed, but WSL/VirtualMachinePlatform must be enabled from an elevated PowerShell session before real containers can run.
- Production version can move to PostgreSQL and Prisma.
- Real isolated VM/lab execution requires Docker Desktop or WSL2. The MVP now includes lab manifests and a safe Dockerfile template, but this machine does not currently have the runtime installed.
- Visual design can be polished further after user-specific corrections.

## Recommended Next Steps

- Apply final UI corrections.
- Add screenshots to presentation materials.
- Deploy to a simple hosting environment.
- Optionally replace SQLite with PostgreSQL/Prisma for production.
- Add richer challenge types and more Kazakhstan/CIS-oriented content.
- Connect Docker/WSL lab launcher after installing the runtime.
