# Windows Setup — Exact Steps

## Install first

1. Node.js LTS
2. Git for Windows
3. PostgreSQL with pgAdmin 4
4. VS Code

Restart VS Code after installing them.

## Verify installations

Open VS Code terminal and run:

```powershell
node -v
npm -v
git --version
psql --version
```

## Extract and open this project

Extract the ZIP, open the extracted folder in VS Code, then run:

```powershell
git init
git add .
git commit -m "chore: initialize car dealership project"
```

## Create database

Open pgAdmin 4.

1. Expand Servers.
2. Connect to PostgreSQL.
3. Right-click Databases.
4. Select Create → Database.
5. Enter `car_dealership`.
6. Save.

## Start backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` and replace `YOUR_PASSWORD`.

Then:

```powershell
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Keep this terminal running.

## Start frontend

Open another VS Code terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open:

```text
http://localhost:5173
```

## Login

User:

```text
user@dealer.com
User@123
```

Admin:

```text
admin@dealer.com
Admin@123
```

## Run tests

Open another terminal:

```powershell
cd backend
npm test
npm run test:coverage
```

## Common problem: psql is not recognized

The application can still work through Prisma even when `psql` is not in PATH.
Use pgAdmin to create the database. If necessary, add PostgreSQL's `bin` folder
to Windows PATH later.
