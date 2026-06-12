# Product Demo Notes

## What To Show First

Show the working learning loop instead of implementation details:

1. Home page with MVP counters
2. Course catalog
3. Course page with lessons
4. Lesson theory
5. Challenge workspace
6. Flag submission
7. Profile progress
8. Leaderboard
9. Admin panel
10. Roadmap

## Strong Talking Points

- The product is localized for Russian-speaking CIS/Kazakhstan learners.
- MVP avoids unsafe real infrastructure and uses controlled flag-based tasks.
- Flags are checked server-side.
- Submitted flags are stored as hashes, not raw answers.
- Admin can grow content without editing code.
- Jira sprint and technical specification already exist.

## Demo Quality Notes

- Run `scripts/smoke-test.ps1` before the presentation.
- Run `scripts/reset-demo-data.ps1` if you want a clean student demo.
- Start with a fresh student account during the demo.
- Use `CYB{port_80_http}` for a clean success path.
- Show one wrong flag first only if there is enough time.
- Use admin login only after showing the learner flow.
