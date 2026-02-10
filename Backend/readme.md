## Goto `https://sales-pdsl.onrender.com/swagger/api` or [click Here](https://sales-pdsl.onrender.com/swagger/api) to find swagger doc.

---

## Table of Contents
- [Tech Stack](#tech-stack)
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
cd Sales/Backend/
```
after this change the file name `.env.example` to `.env`. Then run,

```bash
npm i
npm run dev
```
So, with this and docker installed in your desktop you can now access to this application. 
You can see the API swagger documentation to go through the features implemented.

NOTE: Whenever you call `npm run dev` at first you will be connected to redis and postgreSql. After that,
database will be seeded by first droping all the database table and then seed with fresh data

```bash
Role                       Permission
ADMIN                      All available permission 
AGENT                      CREATE_SINGLE_ENTRY permission
```

```bash
user signning through "/auth/signup" will be Agent
user signning through "/auth/admin-signup" will be Admin
```
---

### API Documentation
while running the local server. Goto `http://localhost:3000/swagger/api` to get access to the swagger documentation.
There you can have the list of api made for this project.

---

### Seed the Data
With the swagger. Use the api endpoint `/sales/batch` to seed these data at first.
```bash
{
  "records": [
    { "userId": 1, "amountSold": 200000, "salesCount": 5 },
    { "userId": 1, "amountSold": 150000, "salesCount": 3 },
    { "userId": 1, "amountSold": 50000, "salesCount": 2 },

    { "userId": 2, "amountSold": 300000, "salesCount": 7 },
    { "userId": 2, "amountSold": 120000, "salesCount": 5 },

    { "userId": 3, "amountSold": 420000, "salesCount": 12 },

    { "userId": 4, "amountSold": 100000, "salesCount": 2 },
    { "userId": 4, "amountSold": 150000, "salesCount": 4 },
    { "userId": 4, "amountSold": 170000, "salesCount": 6 },

    { "userId": 5, "amountSold": 420000, "salesCount": 10 },

    { "userId": 6, "amountSold": 50000, "salesCount": 1 }
  ]
}
```

NOTE: Those userId 1,2,3 and all should be first the user at the user table only then will this seed work.

---

### Project Flow
- This application inserts the sales data in the database.
- Data to be inserted into the sales table can be single or could be multiple.
- It allows complex query to track the progress of sales agent.
- Query computes the rank, total number of sales, and total sales amount.
