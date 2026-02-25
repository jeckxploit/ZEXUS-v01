# ⚙️ ZEXUS Configuration Guide

## 📋 Environment Setup

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

Edit `.env.local` and set:

```bash
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# Z.ai API Key (get from https://chat.z.ai)
ZAI_API_KEY="your-actual-api-key-here"
```

### 3. Generate NextAuth Secret (Optional - for auth features)

```bash
bun run scripts:generate-secret
```

Copy the output to your `.env.local`:
```bash
NEXTAUTH_SECRET="generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push
```

---

## 🔧 Development Commands

```bash
# Start development server
bun run dev

# Run linter
bun run lint

# Fix linting issues
bun run lint:fix

# Database commands
bun run db:generate    # Generate Prisma client
bun run db:push        # Push schema to database
bun run db:migrate     # Run migrations
bun run db:reset       # Reset database
```

---

## 🚨 Environment Validation

The app will fail to start if required environment variables are missing.
You'll see clear error messages indicating which variables need to be set.

**Required:**
- `DATABASE_URL` - Database connection string
- `ZAI_API_KEY` - Z.ai API key

**Optional (for auth):**
- `NEXTAUTH_URL` - Your app URL
- `NEXTAUTH_SECRET` - Session encryption secret
- OAuth provider credentials (Google, GitHub)

---

## 📝 Code Quality

### ESLint Rules Enabled

The following rules are now enforced (warnings/errors):

**TypeScript:**
- `@typescript-eslint/no-unused-vars` - Warn on unused variables
- `@typescript-eslint/no-non-null-assertion` - Error on `!` operator
- `@typescript-eslint/ban-ts-comment` - Warn on TS ignore comments

**React:**
- `react-hooks/rules-of-hooks` - Error on hooks rule violations
- `react-hooks/exhaustive-deps` - Warn on missing dependencies
- `react/self-closing-comp` - Warn on self-closing components

**General:**
- `prefer-const` - Warn when `const` should be used
- `no-console` - Warn on console.log (allow console.warn/error)
- `no-debugger` - Warn on debugger statements
- `no-duplicate-imports` - Warn on duplicate imports

---

## 🎯 Next.js Configuration

### Strict Mode Enabled

React Strict Mode is now **enabled** for better development experience:
- Detects unsafe lifecycles
- Warns about legacy string refs
- Warns about deprecated `findDOMNode`
- Detects unexpected side effects
- Detects legacy context API usage

### TypeScript & ESLint

Build will **fail** on TypeScript/ESLint errors:
- `ignoreBuildErrors: false` - Shows all TypeScript errors
- `ignoreDuringBuilds: false` - Shows all ESLint errors

This ensures code quality in production builds.

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** - Use `bun run scripts:generate-secret`
4. **Validate all inputs** - Zod schemas are your friend
5. **Use HTTPS in production** - Required for auth features

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Zod Documentation](https://zod.dev/)
