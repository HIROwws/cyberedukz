# Day 2 Auth Plan

## Goal

Implement the first real user flow: registration, login, logout, and protected profile access.

## User Stories

- As a visitor, I can register an account.
- As a user, I can log in and log out.
- As a user, I can view my profile.

## Backend Requirements

- Validate email, name, and password.
- Hash passwords before storing them.
- Reject duplicate emails.
- Create a session or signed token after login.
- Protect profile and admin-only routes.

## Frontend Requirements

- Registration page
- Login page
- Profile page
- Russian validation and error messages
- Clear logged-in/logged-out navigation state

## Acceptance Test

1. Register `student@cyberedukz.local`.
2. Log out.
3. Log in with the same account.
4. Open profile.
5. Confirm profile shows name, email, points, and role.

