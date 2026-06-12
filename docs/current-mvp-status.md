# Current MVP Status

## Working Locally

The MVP currently runs without npm dependencies through `server.js`.
Data is stored in local SQLite: `data/cyberedukz.sqlite`.

Local URL:

```text
http://localhost:3000
```

## Implemented User Flow

1. Register a student account.
2. Log in and log out.
3. Open profile.
4. Browse course catalog.
5. Open a course.
6. Open a lesson.
7. Open a challenge.
8. Submit a flag.
9. Receive points.
10. See leaderboard and course progress.
11. Admin can create courses, lessons, and challenges.
12. Admin can edit existing course metadata.
13. User can view a roadmap/demo planning page.
14. Challenge page shows status, attempts, and server-side flag submission context.
15. Profile shows overall progress and recent solved challenges.
16. Admin panel shows content KPIs for courses, lessons, and challenges.
17. Automated smoke test verifies public routes, auth flow, flag submission, admin access, and safe submissions.

## Demo Content

Courses:

- Linux & Networks Basics
- Web Security Starter
- Blue Team Fundamentals

Lessons:

- Файлы и навигация в Linux
- Сеть: порты, DNS и HTTP
- SQL Injection без магии
- XSS и доверие к вводу
- Логи и первые признаки атаки
- Мини-таймлайн инцидента

Demo flags:

- `CYB{hidden_file_found}`
- `CYB{port_80_http}`
- `CYB{sqli_basics}`
- `CYB{reflected_xss}`
- `CYB{brute_force_alert}`
- `CYB{incident_timeline}`

## Jira Tasks That Can Move To Done

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
- Test critical user journey
- Automated smoke test script

## Next Product Work

- Add more polished challenge workspace UI.
- Continue visual design polish in a final pass.
- Prepare screenshots if required by the instructor.
- Apply the user's upcoming site corrections.

## QA

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1
```

Latest result: smoke test passed.
