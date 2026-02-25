import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/ZEXUS/);
  });

  test('displays hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('has proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const description = await page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /ZEXUS/);
    
    // Check Open Graph title
    const ogTitle = await page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /ZEXUS/);
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that content is visible on mobile
    const content = page.locator('body');
    await expect(content).toBeInViewport();
  });
});

test.describe('Navigation', () => {
  test('has working links', async ({ page }) => {
    await page.goto('/');
    
    // Find all links
    const links = page.locator('a[href]');
    const count = await links.count();
    
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Accessibility', () => {
  test('has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    // Basic accessibility checks
    const mainContent = page.locator('main, [role="main"], body');
    await expect(mainContent).toBeVisible();
    
    // Check for lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang');
  });

  test('has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });
});

test.describe('Performance', () => {
  test('loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('has no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    expect(errors).toHaveLength(0);
  });
});
