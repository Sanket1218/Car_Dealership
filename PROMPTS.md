# AI Prompt History

Record every meaningful AI interaction used while developing this project.

## Prompt 1

**Date:** July 30, 2026  
**Tool:** ChatGPT  
**Purpose:** Project architecture and initial implementation

### Prompt

> Create a full-fledged TDD car dealership inventory system with a React and Tailwind frontend, an Express and TypeScript backend, PostgreSQL, Prisma, JWT authentication, testing, documentation, and transparent AI usage.

### Output Used

The initial folder structure, backend API design, React component organization, Prisma models, and test scaffolding were used as a starting point.

### Manual Review Required

Before submitting, I reviewed the source code, ran the application, fixed environment-specific problems, added my own commits, tested each feature, and verified that I could explain the implementation.

---

## Purchase quantity validation test

Prompt used:

"Review the existing purchase service and help me create a genuine failing
test for missing purchase stock validation."

AI usage:

ChatGPT identified that excessive-stock validation was already implemented,
so it suggested testing the missing zero-quantity validation instead. I
reviewed and adapted the Jest mocks and assertions to match the project.
