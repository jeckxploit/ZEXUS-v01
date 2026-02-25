# 🧪 ZEXUS Testing Guide

## Table of Contents

1. [Overview](#overview)
2. [Unit & Integration Tests](#unit--integration-tests)
3. [E2E Tests](#e2e-tests)
4. [Writing Tests](#writing-tests)
5. [Best Practices](#best-practices)

---

## Overview

ZEXUS uses a comprehensive testing stack:

| Tool | Purpose |
|------|---------|
| **Vitest** | Fast unit test runner (Jest-compatible) |
| **React Testing Library** | Component testing utilities |
| **Playwright** | End-to-end browser testing |

---

## Unit & Integration Tests

### Running Tests

```bash
# Run all tests (watch mode)
bun run test

# Run tests once
bun run test:run

# Run with coverage report
bun run test:coverage

# Run with UI dashboard
bun run test:ui

# Run specific test file
bun run test src/components/button.test.tsx

# Run tests matching pattern
bun run test -t "button"
```

### Test Structure

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      # Component tests
├── hooks/
│   ├── useLocalStorage.ts
│   └── useLocalStorage.test.ts  # Hook tests
└── lib/
    ├── api-client.ts
    └── api-client.test.ts   # Utility tests

tests/
├── setup.ts                 # Test configuration
├── mocks.ts                 # Mock data & handlers
└── test-utils.tsx           # Custom render utilities
```

---

## E2E Tests

### Running E2E Tests

```bash
# Run all E2E tests
bun run test:e2e

# Run with UI (Playwright Test Runner)
bun run test:e2e:ui

# Run in debug mode
bun run test:e2e:debug

# Run specific test file
bun run test:e2e e2e/homepage.spec.ts

# Run on specific browser
bun run test:e2e --project=chromium
bun run test:e2e --project=firefox
```

### E2E Test Structure

```
e2e/
├── homepage.spec.ts         # Homepage tests
├── auth.spec.ts             # Authentication tests
└── api/
    └── api.spec.ts          # API tests
```

---

## Writing Tests

### Component Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Tests

```typescript
import { describe, it, expect, act } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocalStorage } from '@/hooks';

describe('useLocalStorage', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('stores value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
  });
});
```

### API Client Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient, ApiErrorClass } from '@/lib/api-client';

describe('ApiClient', () => {
  let api: ApiClient;
  
  beforeEach(() => {
    api = new ApiClient('https://api.example.com');
  });

  it('makes GET requests', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'test' }),
        headers: new Headers(),
      })
    );

    const { data } = await api.get('/endpoint');
    expect(data).toEqual({ data: 'test' });
  });

  it('handles API errors', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Not found' }),
      })
    );

    await expect(api.get('/not-found')).rejects.toThrow(ApiErrorClass);
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/ZEXUS/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('has working navigation', async ({ page }) => {
    await page.goto('/');
    
    const navLink = page.getByRole('link', { name: /features/i });
    await navLink.click();
    
    await expect(page).toHaveURL(/features/);
  });

  test('works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const content = page.locator('body');
    await expect(content).toBeInViewport();
  });
});
```

---

## Best Practices

### 1. Test Naming

```typescript
// ✅ Good - Descriptive names
describe('Button', () => {
  it('handles click events when enabled', () => {});
  it('ignores clicks when disabled', () => {});
});

// ❌ Bad - Vague names
describe('Button tests', () => {
  it('works', () => {});
  it('does stuff', () => {});
});
```

### 2. Test Independence

```typescript
// ✅ Good - Each test is independent
describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('test 1', () => {});
  it('test 2', () => {});
});

// ❌ Bad - Tests depend on each other
describe('useLocalStorage', () => {
  it('test 1', () => {
    localStorage.setItem('key', 'value');
  });
  
  it('test 2', () => {
    // Depends on test 1 setting the value
    const value = localStorage.getItem('key');
  });
});
```

### 3. Use Testing Library Queries

```typescript
// ✅ Good - Accessible queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i');
screen.getByText(/welcome/i');

// ❌ Bad - Direct selectors
document.querySelector('.btn-submit');
document.getElementById('email');
```

### 4. Mock External Dependencies

```typescript
// ✅ Good - Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

// ✅ Good - Use mocks module
import { mockUser, mockApiResponse } from '@/tests/mocks';
```

### 5. Test Edge Cases

```typescript
describe('API Client', () => {
  it('handles successful response', () => {});
  it('handles 404 error', () => {});
  it('handles 500 error', () => {});
  it('handles network timeout', () => {});
  it('handles invalid JSON response', () => {});
  it('retries on failure', () => {});
});
```

### 6. E2E Test Tips

```typescript
// ✅ Good - Wait for specific element
await expect(page.getByText(/loaded/i)).toBeVisible();

// ✅ Good - Use data-testid for stable selectors
await page.getByTestId('submit-button').click();

// ❌ Bad - Fixed delays
await page.waitForTimeout(5000);
```

---

## Coverage Reports

### View Coverage

```bash
# Generate coverage
bun run test:coverage

# Open HTML report
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

### Coverage Thresholds

Current thresholds (in `vitest.config.ts`):

- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Run unit tests
        run: bun run test:run
      
      - name: Run E2E tests
        run: bun run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Troubleshooting

### Common Issues

**1. "Cannot find module" errors**

```bash
# Make sure paths are configured in tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. "window is not defined"**

Make sure tests run in jsdom environment:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```

**3. E2E tests fail to connect**

Start dev server first:

```bash
# Terminal 1
bun run dev

# Terminal 2
bun run test:e2e
```

Or use webServer config in Playwright (already configured).

---

## Commands Summary

```bash
# Unit/Integration Tests
bun run test              # Watch mode
bun run test:run          # Run once
bun run test:coverage     # With coverage
bun run test:ui           # UI dashboard

# E2E Tests
bun run test:e2e          # Run all
bun run test:e2e:ui       # With UI
bun run test:e2e:debug    # Debug mode

# Combined
bun run test && bun run test:e2e  # Run all tests
```

---

## Next Steps

- [ ] Add more component tests
- [ ] Add API integration tests
- [ ] Add visual regression tests
- [ ] Setup CI/CD pipeline
- [ ] Add performance tests
- [ ] Add accessibility tests (axe-core)
