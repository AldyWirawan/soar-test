import { test, expect } from '@playwright/test';
test('Verify all items display', async ({ page }) => {
  // Navigate to Juice Shop
  await page.goto('http://localhost:3000/');
  // Handle welcome banner and cookie consent if they appear
  await page.getByText('Dismiss').click();
  await page.getByText('Me want it!').click();
  
  // Wait for products to load
  await page.waitForSelector('mat-card.mat-card');
  
  // Scroll to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  // Click on items per page dropdown
  await page.locator('mat-select[aria-label="Items per page:"]').click();
  
  // Select maximum items (usually 12 items per page)
  await page.locator('mat-option').last().click();
  
  // Wait for products to reload
  await page.waitForTimeout(1000);
  
  // Get all products
  const products = await page.locator('mat-card.mat-card').count();

  // Get the text content from the pagination label
  const paginatorText = await page.locator('.mat-paginator-range-label').textContent();

  // Extract the second number (expected to be 37 but new product might be added) using regex or string manipulation
  const matches = paginatorText.match(/\d+\s*[–-]\s*(\d+)/);
  const items = parseInt(matches[1]);
  
  // Assert that we have products displayed
  expect(products).toBe(items);
  
  // Optional: Log the number of products found
  console.log(`Found ${products} products on the page`);
});