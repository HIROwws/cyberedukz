# Jira Setup

## Project

- Project name: `CyberEdu KZ`
- Project key: `CEKZ`
- Template: Scrum
- Sprint: `MVP Sprint 1`
- Sprint duration: 14 days

## Workflow

Use a simple workflow:

- To Do
- In Progress
- Review/Test
- Done

## Epics

- `CyberEdu KZ MVP`
- `Auth and User Profile`
- `Course Learning Experience`
- `Gamification and Progress`
- `Admin Content Management`
- `Localization and Demo Content`

## Import Backlog

Use this file:

```text
deliverables/jira_backlog_cyberedukz.csv
```

Recommended Jira CSV mapping:

- `Summary` -> Summary
- `Issue Type` -> Issue Type
- `Priority` -> Priority
- `Epic Name` -> Epic Name
- `Epic Link` -> Epic Link or Parent, depending on Jira version
- `Component` -> Components
- `Description` -> Description

If Jira Cloud does not accept `Epic Link`, import epics first, then create stories/tasks manually under the corresponding epic.

## Day 1 Board Order

Move these to the top of the sprint:

1. `Set up repository and project structure`
2. `Create database schema`
3. `As a visitor, I can register an account`
4. `As a user, I can log in and log out`
5. `As a user, I can view my profile`

## Definition of Done

A Jira issue is done when:

- The behavior is implemented or the document is completed.
- The result can be demonstrated.
- Acceptance criteria are checked.
- Any known limitation is written in the issue comments.

