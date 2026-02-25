# 🛠️ ZEXUS Development Tools Guide

## Table of Contents

1. [Pre-commit Hooks](#pre-commit-hooks)
2. [Commit Convention](#commit-convention)
3. [Error Tracking](#error-tracking)
4. [Error Boundary](#error-boundary)
5. [Utility Hooks](#utility-hooks)
6. [API Client](#api-client)

---

## Pre-commit Hooks

### Husky + lint-staged

Code akan otomatis di-lint sebelum commit:

```bash
# Files akan di-check otomatis saat commit
git commit -m "feat: add new feature"
```

**Yang di-check:**
- `*.ts, *.tsx` - ESLint (auto-fix)
- `*.js, *.jsx` - ESLint (auto-fix)
- `*.css, *.md, *.json` - Prettier (auto-format)

Jika ada error, commit akan ditolak sampai diperbaiki.

---

## Commit Convention

### Conventional Commits

Format commit message:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - Fitur baru
- `fix` - Bug fix
- `docs` - Dokumentasi
- `style` - Formatting (non-functional)
- `refactor` - Refactoring code
- `perf` - Performance improvement
- `test` - Menambah/memperbaiki test
- `build` - Build system/external dependencies
- `ci` - CI configuration
- `chore` - Maintenance tasks
- `revert` - Revert commit sebelumnya

**Contoh:**
```bash
git commit -m "feat(auth): add Google OAuth support"
git commit -m "fix(api): handle null response in user endpoint"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(components): extract button variants"
```

**Subject rules:**
- Maksimal 72 karakter
- Gunakan imperative mood ("add" bukan "added")
- Jangan akhiri dengan titik

---

## Error Tracking

### Sentry Integration

#### Setup

1. Buat account di [Sentry.io](https://sentry.io)
2. Buat project baru (Next.js)
3. Copy DSN ke `.env.local`:

```bash
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/your-project-id"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
SENTRY_AUTH_TOKEN="your-token"
```

#### Usage

**Client-side errors** otomatis tracked.

**Manual tracking:**

```typescript
import * as Sentry from "@sentry/nextjs";

// Capture exception
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// Capture message
Sentry.captureMessage("Something happened");

// Add context
Sentry.setContext("user", { id: 123, name: "John" });
Sentry.setTag("feature", "checkout");
```

**Server-side:**

```typescript
// API routes
import * as Sentry from "@sentry/nextjs";

export async function POST(req: Request) {
  try {
    // ...
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
```

---

## Error Boundary

### React Error Boundary

Komponen untuk menangkap error di child components:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Basic usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={
    <div>Something went wrong!</div>
  }
>
  <MyComponent />
</ErrorBoundary>

// With error handler
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Caught error:', error);
  }}
>
  <MyComponent />
</ErrorBoundary>
```

**Features:**
- Auto-capture ke Sentry
- Custom fallback UI
- Error handler callback
- Reset button untuk retry

---

## Utility Hooks

### useLocalStorage

Persist state ke localStorage:

```typescript
import { useLocalStorage } from '@/hooks';

function MyComponent() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={removeTheme}>Reset</button>
    </div>
  );
}
```

**Features:**
- Auto-sync across tabs
- Error handling
- SSR-safe
- Function updates support

### useSessionStorage

Sama seperti useLocalStorage tapi untuk sessionStorage:

```typescript
import { useSessionStorage } from '@/hooks';

const [cart, setCart, clearCart] = useSessionStorage('cart', []);
```

### useFetch

Fetch data dengan retry & timeout:

```typescript
import { useFetch } from '@/hooks';

function UserProfile() {
  const { data, loading, error, refetch } = useFetch('/api/user/123', {
    retry: 3,
    retryDelay: 1000,
    timeout: 5000,
  });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data?.name}</div>;
}
```

**Features:**
- Auto-fetch on mount
- Retry on failure
- Timeout support
- Abort on unmount
- Manual refetch

### useDebouncedFetch

Fetch dengan debounce (untuk search):

```typescript
import { useDebouncedFetch } from '@/hooks';

function SearchResults({ query }) {
  const { data, loading } = useDebouncedFetch(
    `/api/search?q=${query}`,
    300 // debounce 300ms
  );
  
  // ...
}
```

---

## API Client

### ApiClient

HTTP client dengan error handling & retry:

```typescript
import { api } from '@/lib/api-client';

// GET request
const { data } = await api.get<User>('/users/123');

// POST request
const { data } = await api.post('/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT/PATCH
const { data } = await api.put('/users/123', { name: 'Jane' });
const { data } = await api.patch('/users/123', { email: 'new@example.com' });

// DELETE
const { data } = await api.delete('/users/123');

// With options
const { data } = await api.get('/users', {
  timeout: 10000,
  retry: 2,
  headers: { 'Authorization': 'Bearer token' }
});
```

### Custom Instance

```typescript
import { ApiClient } from '@/lib/api-client';

const externalApi = new ApiClient('https://api.external.com', {
  timeout: 5000,
  maxRetries: 3,
  defaultHeaders: {
    'X-API-Key': 'your-api-key'
  }
});

const { data } = await externalApi.get('/endpoint');
```

### Error Handling

```typescript
import { api, ApiErrorClass } from '@/lib/api-client';

try {
  const { data } = await api.get('/users/123');
} catch (error) {
  if (error instanceof ApiErrorClass) {
    console.error('API Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    });
  } else {
    console.error('Network Error:', error);
  }
}
```

**Features:**
- Auto-retry on failure
- Timeout support
- Error parsing
- Sentry integration
- AbortController support
- Type-safe responses

---

## Development Commands

```bash
# Run development server
bun run dev

# Build for production
bun run build

# Create standalone build
bun run build:standalone

# Run linter
bun run lint
bun run lint:fix

# Type check
bun run typecheck

# Generate NextAuth secret
bun run scripts:generate-secret

# Database commands
bun run db:push
bun run db:generate
bun run db:migrate
```

---

## Best Practices

### 1. Error Handling

```typescript
// ✅ Good - Use ErrorBoundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserProfile userId={id} />
</ErrorBoundary>

// ✅ Good - Handle errors in hooks
const { data, error } = useFetch('/api/user');
if (error) return <ErrorDisplay error={error} />;

// ❌ Bad - Ignore errors
const { data } = useFetch('/api/user');
return <div>{data.name}</div>; // Could crash
```

### 2. API Calls

```typescript
// ✅ Good - Use API client
const { data } = await api.get('/users');

// ✅ Good - Handle errors
try {
  await api.post('/users', userData);
} catch (error) {
  handleError(error);
}

// ❌ Bad - Raw fetch without error handling
const res = await fetch('/api/users');
const data = await res.json();
```

### 3. Commits

```bash
# ✅ Good - Descriptive
git commit -m "feat(auth): add password reset functionality"

# ❌ Bad - Vague
git commit -m "fix stuff"
git commit -m "update code"
```

### 4. State Persistence

```typescript
// ✅ Good - Use hooks
const [theme] = useLocalStorage('theme', 'light');
const [filters] = useSessionStorage('filters', {});

// ❌ Bad - Manual localStorage
const theme = localStorage.getItem('theme') || 'light';
```

---

## Next Steps

Untuk upgrade selanjutnya:

- [ ] **Testing Setup** - Vitest + React Testing Library + Playwright
- [ ] **Database Migration** - SQLite → PostgreSQL
- [ ] **Email System** - Resend/SendGrid integration
- [ ] **File Upload** - S3/Cloudinary integration
- [ ] **Caching** - Redis integration
- [ ] **Documentation** - Storybook for components
