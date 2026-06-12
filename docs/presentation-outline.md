# CyberEdu KZ Presentation Outline

## Slide 1: CyberEdu KZ

Web application for practical cybersecurity learning, adapted for CIS and Kazakhstan.

Key message:

> A localized TryHackMe/HackTheBox-style MVP with courses, lessons, flags, progress, leaderboard, and admin content management.

## Slide 2: Problem

- Cybersecurity learning platforms are often English-first.
- Beginners need guided, safe, practical tasks.
- Kazakhstan/CIS learners benefit from Russian interface and local context.
- Real lab infrastructure is expensive and complex for an MVP.

## Slide 3: Solution

CyberEdu KZ provides:

- structured courses
- short theory
- practice challenges
- server-side flag validation
- progress and points
- leaderboard
- admin content management

## Slide 4: MVP Scope

Implemented:

- registration and login
- course catalog
- lessons
- challenges
- flag submission
- profile and progress
- leaderboard
- roadmap
- admin panel
- labs architecture
- smoke-test

Out of scope:

- real isolated VM labs
- payments
- certificates
- production database deployment

## Slide 5: User Flow

1. Register
2. Open course
3. Read lesson
4. Submit flag
5. Get points
6. Track progress
7. View leaderboard

## Slide 6: Security Approach

- Passwords are hashed.
- Flags are checked server-side.
- Submitted flags are stored as hashes.
- Admin routes require admin role.
- Tasks are educational and safe.

## Slide 7: Jira and Planning

- 14-day MVP sprint
- backlog imported into Jira
- epics and stories created
- core user journey prioritized first
- admin and polish added after core flow

## Slide 8: Demo

Open:

```text
http://localhost:3000
```

Demo flag:

```text
CYB{port_80_http}
```

Admin:

```text
admin@cyberedukz.local
Admin12345
```

## Slide 9: Current Result

- 5 courses
- 10 lessons
- 10 challenges
- working admin panel
- lab manifests and Docker template
- automated smoke-test
- technical specification
- Jira sprint

## Slide 10: Next Steps

- final UI corrections
- screenshots and deployment
- PostgreSQL/Prisma migration
- more Kazakhstan/CIS content
- richer challenge types
- future isolated labs
