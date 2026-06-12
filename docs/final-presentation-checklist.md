# Final Presentation Checklist

## Before Presentation

- Start local server.
- Open Jira sprint board.
- Open technical specification DOCX.
- Open demo script.
- Open final MVP report.
- Keep demo flags ready.

## Start Server

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```

Open:

```text
http://localhost:3000
```

Optional smoke test:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1
```

Optional clean demo reset:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-demo-data.ps1
```

## Demo Accounts

Admin:

```text
admin@cyberedukz.local
Admin12345
```

Student:

Create a new account during the demo.

## Demo Route

1. Home page
2. Roadmap page
3. Labs page
4. Course catalog
5. Linux & Networks course
6. Networking lesson
7. Open port challenge
8. Submit flag
9. Profile progress
10. Leaderboard
11. Admin panel

Demo flag:

```text
CYB{port_80_http}
```

## Jira Done Candidates

- Set up repository and project structure
- Create database schema
- As a visitor, I can register an account
- As a user, I can log in and log out
- As a user, I can view my profile
- As a learner, I can browse courses
- As a learner, I can open a course page
- As a learner, I can read a lesson
- As a learner, I can submit a flag
- Implement server-side flag validation
- As a learner, I can see course progress
- As a learner, I can see leaderboard
- Seed MVP demo content
- As an admin, I can create and edit courses
- As an admin, I can create challenges
- Write README and demo script

## Known Limitations To Mention

- Current MVP uses a local JSON database for speed.
- Production version should migrate to PostgreSQL/Prisma.
- Real isolated labs/VMs are out of MVP scope.
- UI polish is ongoing and intentionally scheduled after core functionality.
