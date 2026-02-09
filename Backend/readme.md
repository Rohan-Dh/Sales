**Swagger docs** available at `https://sales-pdsl.onrender.com/swagger/api`
---
## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Setup](#project-setup)
    - [Local Development](#local-development)
- [Api Documentation](#api-documentation)
- [ProjectFlow](#project-flow)

---

## Tech Stack
- **NestJS** (Node.js framework)
- **PostgreSQL**
- **TypeORM**
- **class-validator / class-transformer** (validation)
- **Swagger** (OpenAPI docs)

---

## Features
- Accepts sales records containing:
    - `agentName` (selling agent’s name)
    - `amountSold` (sales amount)
    - `salesCount` (number of deals/sales made in that record)
- Multiple records can exist for the same agent.
- Leaderboard shows:
    - rank (1, 2, 3…)
    - agent name
    - total sales amount
    - total sales count

---

## Architecture
- **Database Connection Module**
    - find it in `/src/core/`.
    - connected using `TypeOrm` to the `PostgreSQL` running in `docker` for development and `render` for production
- **Sales Module**
    - Find it in /src/features/.
    - Can add one or many `sales` record
- **Leaderboard Module**
    - Find it in `/src/features/`.
    - It Aggregates and ranks sales using `PostgreSQL` query:
        - `GROUP BY agentName`
        - `SUM(amountSold)` and `SUM(salesCount)`

This design is scalable because aggregation happens in the database.

---

## Project Setup
Make sure you have a docker installed first, this api service requires postgreSql.

### Local Development
```bash
git clone https://github.com/Rohan-Dh/Sales.git
cd Sales
```
after this change the file name `.env.example` to `.env`. Then run,

```bash
npm i
npm run dev
```
So, with this and docker installed in your desktop you can now access to this application. 
You can see the API swagger documentation to go through the features implemented.

### API Documentation
while running the local server. Goto `http://localhost:3000/swagger/api` to get access to the swagger documentation.
There you can have the list of api made for this project.

### Seed the Data
With the swagger. Use the api endpoint `/sales/batch` to seed these data at first.
```bash
{
  "records": [
    { "agentName": "Ram Sharma", "amountSold": 200000, "salesCount": 5 },
    { "agentName": "Ram Sharma", "amountSold": 150000, "salesCount": 3 },
    { "agentName": "Ram Sharma", "amountSold": 50000, "salesCount": 2 },

    { "agentName": "Sita Karki", "amountSold": 300000, "salesCount": 7 },
    { "agentName": "Sita Karki", "amountSold": 120000, "salesCount": 5 },

    { "agentName": "Hari Joshi", "amountSold": 420000, "salesCount": 12 },

    { "agentName": "Nisha Thapa", "amountSold": 100000, "salesCount": 2 },
    { "agentName": "Nisha Thapa", "amountSold": 150000, "salesCount": 4 },
    { "agentName": "Nisha Thapa", "amountSold": 170000, "salesCount": 6 },

    { "agentName": "Bikash Lama", "amountSold": 420000, "salesCount": 10 },

    { "agentName": "Alina Shrestha", "amountSold": 50000, "salesCount": 1 }
  ]
}
```

### ProjectFlow
- This application inserts the sales data in the database.
- Data to be inserted into the sales table can be single or could be multiple.
- It allows complex query to track the progress of sales agent.
- Query computes the rank, total number of sales, and total sales amount.
