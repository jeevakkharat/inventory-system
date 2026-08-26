# Inventory & Asset Management System

A secure backend for managing inventory, purchases, stock transfers, and
asset assignments, with RBAC and full audit logging — built from the
project's SRS.

## Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Auth:** JWT + bcrypt password hashing
- **Validation:** Zod

> Note: purchases, transfers, and assignments each update inventory and
> write an audit log inside one atomic operation. In MongoDB this requires
> **multi-document transactions**, which need a replica set — a local
> single-node replica set or MongoDB Atlas (free tier included) both work.
> A standalone `mongod` without a replica set will error on these routes.

## Project Structure

```
backend/
  src/
    config/db.js     # Mongoose connection
    models/          # Role, User, Category, Item, Location, Purchase, Transfer, Assignment, AuditLog
    controllers/      # Route handlers
    middleware/       # authenticate, authorize (RBAC), error handling
    routes/           # Express routers per module
    services/         # Audit logging service
    validators/        # Zod request schemas
    utils/            # JWT helpers, ApiError, asyncHandler
    seed.js           # Demo roles + users + sample item/location
    app.js
  server.js
  .env.example
frontend/              # (not yet scaffolded — React app goes here)
```

## Getting Started (Backend)    

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm run seed
npm run dev
``` 



The API starts on `http://localhost:5000`. Health check: `GET /health`.

### Enabling MongoDB transactions locally

If you're running MongoDB locally rather than on Atlas, initialize it as a
single-node replica set once:

```bash
mongod --replSet rs0 --dbpath /path/to/data
# in a separate mongo shell:
mongosh --eval "rs.initiate()"
```

Then point `MONGODB_URI` at it as usual — transactions will work normally.

## Demo Credentials (after seeding)

| Role     | Email                | Password     |
|----------|-----------------------|--------------|
| Admin    | admin@example.com     | Admin@123    |
| Manager  | manager@example.com   | Manager@123  |
| Employee | employee@example.com  | Employee@123 |

Replace these before any real deployment.

## Core Business Flow

```
PURCHASE → INVENTORY UPDATED → TRANSFER → ASSIGNMENT → AUDIT LOG
```

Purchases, transfers, and assignments run inside Mongoose
`session.withTransaction()` blocks so the inventory update and the audit
record commit atomically — if one fails, both roll back.

## RBAC Summary

| Role              | Access                                                        |
|-------------------|----------------------------------------------------------------|
| Admin             | Full access: users, roles, inventory, purchases, transfers, assignments, audit logs |
| Manager           | Inventory, purchases, transfers, assignments                  |
| Inventory Manager | Inventory and stock operations                                 |
| Employee          | View assets assigned to them                                   |
| Auditor           | View transactions and audit logs                                |

## API Endpoints

See `backend/src/routes/` — endpoints match SRS section 7 exactly
(`/api/auth`, `/api/users`, `/api/items`, `/api/purchases`,
`/api/transfers`, `/api/assignments`, `/api/audit-logs`).

Note: IDs referenced in request bodies (`roleId`, `categoryId`, `itemId`,
`userId`, `sourceLocationId`, etc.) are MongoDB ObjectId strings (24 hex
characters), not integers.

## Next Steps

- [ ] Scaffold the React frontend (`frontend/`) with pages for each module and role-based UI gating
- [ ] Add pagination to list endpoints
- [ ] Deploy backend (Render) + database (MongoDB Atlas) + frontend (Vercel)
- [ ] Record the 3–5 minute walkthrough video per the submission checklist

