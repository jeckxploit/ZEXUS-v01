# 🗄️ ZEXUS PostgreSQL Migration Guide

## Overview

ZEXUS telah di-migrate dari SQLite ke **PostgreSQL 16** untuk production-ready database.

### Kenapa PostgreSQL?

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Concurrency** | Limited (file locks) | Full ACID with MVCC |
| **Scalability** | Single file | Distributed, replication |
| **Data Types** | Basic | Rich (JSON, arrays, etc.) |
| **Full-Text Search** | Basic | Advanced with ranking |
| **Geospatial** | No | PostGIS support |
| **Production Use** | Development only | Enterprise-grade |

---

## Quick Start

### 1. Start PostgreSQL (Local)

```bash
# Start PostgreSQL dengan Docker
bun run db:up

# Check logs
bun run db:logs

# Stop PostgreSQL
bun run db:down
```

### 2. Setup Database

```bash
# Generate Prisma Client
bun run db:generate

# Push schema to database (development)
bun run db:push

# OR run migrations (production)
bun run db:migrate
```

### 3. Seed Database

```bash
# Seed sample data
bun prisma db seed
```

---

## Database Schema

### Models Overview

```
User (users)
├── id, email, name, password, role
├── emailVerified, image
├── accounts (1:n)
├── sessions (1:n)
└── posts (1:n)

Account (accounts) - NextAuth OAuth
├── provider, providerAccountId
├── access_token, refresh_token
└── user (n:1)

Session (sessions) - NextAuth Sessions
├── sessionToken, expires
└── user (n:1)

Post (posts)
├── title, slug, content, excerpt
├── published, featured, views
├── author (n:1)
├── categories (n:m)
└── tags (n:m)

Category (categories)
└── posts (1:n)

Tag (tags)
└── posts (n:m)

PostToTag (posts_to_tags)
└── Many-to-many junction table
```

### User Roles

```typescript
enum Role {
  USER       // Regular user
  ADMIN      // Full access
  MODERATOR  // Content moderation
}
```

---

## Environment Variables

### Development (Docker)

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zexus?schema=public"
```

### Production

```bash
# Managed PostgreSQL (Vercel/Supabase/Railway)
DATABASE_URL="postgresql://user:password@host:5432/zexus?schema=public"

# Connection pooling (recommended for serverless)
DATABASE_URL="postgresql://user:password@pooler:5432/zexus?schema=public&pgbouncer=true"
```

### With Prisma Accelerate

```bash
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=xxx"
DIRECT_URL="postgresql://user:password@host:5432/zexus"
```

---

## Docker Setup

### Services

| Service | Port | Credentials |
|---------|------|-------------|
| PostgreSQL | 5432 | postgres:postgres |
| pgAdmin | 5050 | admin@zexus.local:admin |

### Commands

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres

# View logs
docker-compose logs -f postgres

# Restart service
docker-compose restart postgres

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Access pgAdmin

1. Open http://localhost:5050
2. Login: `admin@zexus.local` / `admin`
3. Add connection:
   - Host: `postgres` (Docker network)
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

---

## Migrations

### Development Workflow

```bash
# After schema changes
bun run db:push          # Quick push (dev only)

# Create migration
bun run db:migrate       # Create and apply migration

# Reset database (WARNING: deletes all data)
bun run db:reset
```

### Production Workflow

```bash
# Generate migration SQL
npx prisma migrate dev --create-only

# Review migration file
# prisma/migrations/YYYYMMDDHHMMSS_migration_name/migration.sql

# Apply to production
npx prisma migrate deploy
```

---

## Seed Data

### Default Users

| Email | Role | Password |
|-------|------|----------|
| admin@zexus.local | ADMIN | - |
| mod@zexus.local | MODERATOR | - |
| user@zexus.local | USER | - |

### Sample Content

- 3 Categories (Technology, Design, AI)
- 5 Tags (Next.js, React, TypeScript, Tailwind, Prisma)
- 3 Sample Posts

### Custom Seed

Edit `prisma/db/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Your seed logic
  await prisma.user.create({ ... });
}

main();
```

Run seed:
```bash
bun prisma db seed
```

---

## Prisma Client Usage

### Basic Queries

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
  },
});

// Find with relations
const post = await prisma.post.findUnique({
  where: { slug: 'my-post' },
  include: {
    author: true,
    categories: true,
    tags: true,
  },
});

// Update
await prisma.post.update({
  where: { id: postId },
  data: { views: { increment: 1 } },
});

// Delete
await prisma.post.delete({
  where: { id: postId },
});
```

### Advanced Queries

```typescript
// Pagination
const posts = await prisma.post.findMany({
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' },
  where: { published: true },
});

// Full-text search (PostgreSQL)
const results = await prisma.$queryRaw`
  SELECT * FROM posts
  WHERE to_tsvector('english', title || ' ' || content)
    @@ to_tsquery('english', ${searchQuery})
`;

// Aggregations
const stats = await prisma.post.aggregate({
  _count: { id: true },
  _sum: { views: true },
  _avg: { views: true },
  where: { published: true },
});

// Transactions
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  await tx.post.create({ data: { authorId: user.id } });
});
```

---

## Database Backup

### Manual Backup

```bash
# Backup to file
docker exec zexus-postgres pg_dump -U postgres zexus > backup.sql

# Restore from file
docker exec -i zexus-postgres psql -U postgres zexus < backup.sql
```

### Automated Backup

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * docker exec zexus-postgres pg_dump -U postgres zexus > /backups/zexus-$(date +\%Y\%m\%d).sql
```

---

## Performance Optimization

### Connection Pooling

For serverless/edge:

```bash
# Use PgBouncer or Prisma Accelerate
DATABASE_URL="postgresql://user:pass@host:6543/zexus?schema=public"
DIRECT_URL="postgresql://user:pass@host:5432/zexus?schema=public"
```

### Indexes

Schema already includes indexes:

```prisma
@@index([slug])
@@index([authorId])
@@index([published])
```

### Query Optimization

```typescript
// ✅ Good - Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true },
});

// ✅ Good - Use include for relations
const posts = await prisma.post.findMany({
  include: { author: { select: { name: true } } },
});

// ❌ Bad - Loading everything
const posts = await prisma.post.findMany();
```

---

## Troubleshooting

### Connection Errors

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker-compose logs postgres

# Test connection
docker exec zexus-postgres psql -U postgres -d zexus -c "SELECT 1"
```

### Migration Errors

```bash
# Reset database (development only)
bun run db:reset

# Or manually
docker exec zexus-postgres psql -U postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
bun run db:push
```

### Prisma Client Errors

```bash
# Regenerate client
bun run db:generate

# Clear cache
rm -rf node_modules/.prisma
bun run db:generate
```

---

## Production Deployment

### Vercel + Neon/Supabase

1. Create database at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy connection string to `.env.local`
3. Add to Vercel environment variables
4. Deploy:

```bash
vercel env pull
bun run db:generate
bun run build
```

### Railway

1. Add PostgreSQL plugin in Railway
2. Copy `DATABASE_URL` to environment
3. Deploy automatically

### Self-Hosted

```bash
# docker-compose.prod.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: zexus
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"  # Bind to localhost only
```

---

## Security Best Practices

1. **Use strong passwords** for database users
2. **Limit network access** - bind to localhost only
3. **Use SSL** for production connections
4. **Rotate credentials** regularly
5. **Backup regularly** and test restores
6. **Monitor queries** for slow performance
7. **Use connection pooling** to prevent exhaustion
8. **Apply migrations** in CI/CD pipeline

---

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PgAdmin Docs](https://www.pgadmin.org/docs/)

---

## Commands Summary

```bash
# Docker
bun run db:up              # Start PostgreSQL
bun run db:down            # Stop PostgreSQL
bun run db:restart         # Restart PostgreSQL
bun run db:logs            # View logs

# Prisma
bun run db:generate        # Generate Prisma Client
bun run db:push            # Push schema (dev)
bun run db:migrate         # Run migrations
bun run db:reset           # Reset database
bun prisma db seed         # Seed database

# Combined
bun run db:up && bun run db:generate && bun run db:push && bun prisma db seed
```
