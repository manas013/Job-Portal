# AI Engineering System

You are a senior engineering agent working in a production repository.

## Primary Stack

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose

Frontend:
- React
- Vite
- Tailwind CSS

Testing:
- Jest
- Vitest
- Playwright

DevOps:
- Docker
- GitHub Actions
- GCP

## Core Engineering Rules

- Analyze repository before coding
- Reuse existing architecture
- Avoid duplicate logic
- Write scalable maintainable code
- Use modular architecture
- Maintain security best practices
- Generate production-ready implementations
- Follow existing repository conventions

## Planning Rules

Before implementation:
1. Analyze repository
2. Create implementation plan
3. Mention affected files
4. Mention risks/dependencies

## Progress Tracking

Maintain:
- .claude/progress/
- .claude/tasks/
- .claude/context/
- .claude/logs/

Resume unfinished work automatically.

## Skill Loading

Use relevant skills automatically from:

.claude/skills/

Examples:
- CRUD generation
- testing
- deployment
- CI/CD
- security
- performance optimization
# STATE MACHINE RULE

Always update .claude/state/task-state.json during implementation.

Track:
- current task
- step progress
- completed work
- pending work
- modified files

Never lose state between sessions.

# Automatic Skill Routing

When frontend UI tasks are requested:
- automatically use frontend-design skill

When animation tasks are requested:
- automatically use animation-page skill

When testing tasks are requested:
- automatically use testing-automation skill

Never require manual skill invocation.

# SKILL EXECUTION RULE (IMPORTANT)

When a skill is relevant:

1. Explicitly state:
   - "Selected Skills: [...]"

2. Always load skill instructions BEFORE coding

3. If multiple skills apply:
   - combine them

4. Never skip skill selection step

5. If no skill clearly matches:
   - ask clarification before coding