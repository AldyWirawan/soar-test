import { test, expect } from '@playwright/test';
test('Check Apple Juice product details and review', async ({ page }) => {
  // Navigate to Juice Shop
  await page.goto('http://localhost:3000/');
  // Handle welcome banner and cookie consent if they appear
  await page.getByText('Dismiss').click();
  await page.getByText('Me want it!').click();
  
  // Click on Apple Juice product
  await page.locator('mat-card.mat-card').first().click();

  // Assert that product dialog is visible
  const productDialog = page.locator('mat-dialog-container');
  await expect(productDialog).toBeVisible();

  // Assert product image exists
  const productImage = productDialog.locator('img');
  await expect(productImage).toBeVisible();

  // Try to find and click on reviews if they exist
  try {
    await page.click('text=Reviews');
    // Wait a few seconds to see the expanded review
    await page.waitForTimeout(2000);
    
    // Get the number of reviews
    const reviewsSection = page.locator('.comment');
    const reviewCount = await reviewsSection.count();
    console.log(`Number of reviews found: ${reviewCount}`);

  } catch (e) {
    console.log('No reviews available or review section not found');
  }

  // Close the product dialog
  await page.click('button[aria-label="Close Dialog"]');
});