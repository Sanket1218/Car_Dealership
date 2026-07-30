# Car Dealership Inventory System

A full-stack, test-driven vehicle inventory application built with React, Tailwind CSS, Express, TypeScript, PostgreSQL, Prisma, JWT, Jest, and Supertest.

## Features

- User registration and JWT login
- Role-based access (`USER` and `ADMIN`)
- Browse and search vehicles
- Search by make, model, category, and price range
- Purchase vehicles with stock validation
- Admin vehicle creation, editing, deletion, and restocking
- Persistent PostgreSQL database
- Backend tests and coverage commands
- Responsive React/Tailwind interface

## Project Structure

```text
car-dealership-inventory/
├── backend/
├── frontend/
├── screenshots/
├── PROMPTS.md
├── TEST_REPORT.md
└── README.md
```

## Prerequisites

Install:

- Node.js LTS
- Git
- PostgreSQL and pgAdmin
- VS Code

## 1. Database Setup

Open pgAdmin and create a database named:

```text
car_dealership
```

## 2. Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` and put your PostgreSQL password in `DATABASE_URL`.

```bash
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Demo Accounts

After running the seed:

### Admin

```text
Email: admin@dealer.com
Password: Admin@123
```

### User

```text
Email: user@dealer.com
Password: User@123
```

Change these credentials before using the application publicly.

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/vehicles` | Authenticated |
| GET | `/api/vehicles/search` | Authenticated |
| POST | `/api/vehicles` | Admin |
| PUT | `/api/vehicles/:id` | Admin |
| DELETE | `/api/vehicles/:id` | Admin |
| POST | `/api/vehicles/:id/purchase` | Authenticated |
| POST | `/api/vehicles/:id/restock` | Admin |

## Testing

```bash
cd backend
npm test
npm run test:coverage
```

## Test-Driven Development

For each feature, use the following commit pattern:

```text
test: add failing registration tests
feat: implement user registration
refactor: extract password utilities
```

## My AI Usage

### Tools Used

- ChatGPT

### How AI Was Used

ChatGPT was used to help plan the application architecture, create initial boilerplate, identify validation and inventory edge cases, and review testing scenarios.

All generated code must be reviewed, understood, tested, and modified where necessary before submission.

### Reflection

AI accelerated repetitive setup and helped identify edge cases such as insufficient stock, duplicate users, and role-based access. It was used as a development assistant rather than as a substitute for understanding the application.

## Example AI Co-authored Commit

```bash
git commit -m "feat: implement vehicle purchase

Used ChatGPT to review inventory validation and transaction handling.
I manually tested and adapted the implementation.

Co-authored-by: ChatGPT <AI@users.noreply.github.com>"
```

## Deployment

Suggested services:

- Frontend: Vercel
- Backend: Render or Railway
- PostgreSQL: Neon, Supabase, Render, or Railway

## Screenshots
![alt text](image-1.png)