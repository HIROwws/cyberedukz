# CyberEdu KZ Demo Script

## Goal

Show that CyberEdu KZ is not only a technical specification, but a working MVP with Jira planning, user flow, learning content, flag validation, progress, leaderboard, and admin content management.

## 5-Minute Presentation Flow

### 1. Product Context

CyberEdu KZ is a cybersecurity learning platform adapted for Russian-speaking CIS users and Kazakhstan.

The MVP is inspired by TryHackMe, Hack The Box Academy, PortSwigger Academy, picoCTF, and OverTheWire, but focuses on a realistic two-week solo scope.

### 2. Jira Planning

Open Jira and show:

- Sprint `CYB Sprint 1`
- Backlog imported from CSV
- Completed tasks for project setup, schema, auth, courses, lessons, flag validation, progress, leaderboard, and seed content

Key phrase:

> I structured the project as a two-week MVP sprint and split it into epics, stories, and implementation tasks.

### 3. Technical Specification

Open `deliverables/CyberEdu_KZ_Technical_Spec.docx`.

Show:

- goals
- target audience
- functional requirements
- 14-day plan
- risks and limitations

Key phrase:

> The MVP deliberately avoids real attack infrastructure and focuses on safe educational challenges.

### 4. Working Website

Open:

```text
http://localhost:3000
```

Show:

1. Home page
2. Registration
3. Profile
4. Course catalog
5. Course page
6. Lesson page
7. Challenge page
8. Flag submission
9. Progress update
10. Leaderboard

Demo flag:

```text
CYB{port_80_http}
```

### 5. Admin Panel

Log in as admin:

```text
admin@cyberedukz.local
Admin12345
```

Open:

```text
http://localhost:3000/admin
```

Show:

- create course form
- edit course metadata
- create lesson form
- create challenge form
- content summary table

Key phrase:

> The MVP supports content growth without editing source code.

## Backup Demo Flags

- `CYB{hidden_file_found}`
- `CYB{port_80_http}`
- `CYB{sqli_basics}`
- `CYB{reflected_xss}`
- `CYB{brute_force_alert}`
- `CYB{incident_timeline}`

## Known MVP Limitations

- No real VM/lab isolation yet.
- No payment or certificate module.
- No production database deployment yet.
- UI will receive final polishing near the end of the sprint.

## Closing Line

CyberEdu KZ already demonstrates the core learning loop: register, learn, practice, submit a flag, gain progress, and compete on the leaderboard.
