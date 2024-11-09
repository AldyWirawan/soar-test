import { test, expect } from '@playwright/test';
test('User registration and login flow with validation checks, then E2E purchase ', async ({ page }) => {
  // Test data
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Test@123456',
    securityAnswer: 'TestAnswer'
  };

  // Navigate to Juice Shop Registration page
  await page.goto('http://localhost:3000/login#/register');
  // Handle welcome banner and cookie consent if they appear
  await page.getByText('Dismiss').click();
  await page.getByText('Me want it!').click();

  // Test form validation by clicking fields without entering data
  await page.getByLabel('Email').click();
  await page.getByLabel('Field for the password').click();
  await page.getByLabel('Field to confirm the password').click();
  
  // Assert validation messages are present
  const emailValidation = page.locator('mat-error:has-text("Please provide an email address.")');
  const passwordValidation = page.locator('mat-error:has-text("Please provide a password.")');
  await expect(emailValidation).toBeVisible();
  await expect(passwordValidation).toBeVisible();

  // Fill the registration form
  await page.getByLabel('Email').fill(testUser.email);
  await page.getByLabel('Field for the password').fill(testUser.password);
  await page.getByLabel('Field to confirm the password').fill(testUser.password);

  // Select and answer security question
  await page.locator('mat-select[name="securityQuestion"]').click();
  await page.getByRole('option', { name: 'Your eldest siblings middle name?' }).click();
  await page.getByLabel('Answer').fill(testUser.securityAnswer);

  // Show password advice
  await page.getByText('Show password advice').click();

  // wait for language popup that conflicted with button
  await page.waitForTimeout(4000);

  // Register
  await page.getByText('Register').click();

  // Assert successful registration
  const successMessage = page.locator('.mat-simple-snack-bar-content');
  await expect(successMessage).toBeVisible();
  await expect(successMessage).toContainText('Registration completed successfully');

  // Login with the registered account
  await page.getByLabel('Email').fill(testUser.email);
  await page.getByLabel('Text field for the login password').fill(testUser.password);
  await page.getByRole('button', { name: 'Login' }).nth(0).click();

  // Assert successful login
  await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();

  // wait all popup gone before starting add basket
  await page.getByText('X', {exact: true}).click();

  // wait for product to be populated
  await page.waitForTimeout(5000);

    // Add 5 different products to basket, start from index 6 cos first 6 button is not product, [should have better approach]
  for (let i = 6; i < 11; i++) {
  
      // Click add to basket button for each product
      const addToBasketButtons = await await page.$$('.mat-button-base');
      addToBasketButtons[i].click();
      
      // Assert success message appears
      await expect(page.locator('.mat-simple-snack-bar-content')).toBeVisible();
      await expect(page.locator('.mat-simple-snack-bar-content')).toContainText('to basket');
      await page.getByText('X', {exact: true}).click();
  
      // Assert cart number updates
      const cartCounter = await page.locator('span.fa-layers-counter');
      await expect(cartCounter).toHaveText(`${i - 6 + 1}`);
    }
  
    // Navigate to basket
    await page.locator('[aria-label="Show the shopping cart"]').click();
  
    // Get initial total price
    const initialPrice = await page.locator('#price').textContent();
  
    // Increase quantity of first product
    await page.locator('mat-row').first().getByRole('button').nth(1).click();
    
    // Wait for price update
    await page.waitForTimeout(1000);
  
    // Delete the product
    await page.locator('mat-row').first().getByRole('button').nth(2).click();
  
    // Assert total price has changed
    const updatedPrice = await page.locator('#price').textContent();
    expect(initialPrice).not.toEqual(updatedPrice);
  
    // Proceed to checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
  
    // Add new address
    await page.getByLabel('Add a new address').click();
    await page.fill('input[data-placeholder="Please provide a country."]', 'United States');
    await page.fill('input[data-placeholder="Please provide a name."]', 'John Doe');
    await page.fill('input[data-placeholder="Please provide a mobile number."]', '1234567890');
    await page.fill('input[data-placeholder="Please provide a ZIP code."]', '12345');
    await page.fill('textarea[data-placeholder="Please provide an address."]', '123 Test Street');
    await page.fill('input[data-placeholder="Please provide a city."]', 'Test City');
    await page.fill('input[data-placeholder="Please provide a state."]', 'Test State');
    await page.getByRole('button', { name: 'send Submit' }).click();
  
    // Select address and continue
    await page.locator('mat-radio-button').first().click();
    await page.getByLabel('Proceed to payment selection').click();
  
    // Select delivery speed and continue
    await page.locator('.mat-radio-outer-circle').first().click();
    await page.getByLabel('Proceed to delivery method').click();
  
    // Assert wallet has no money
    expect(page.getByText('0.00')).toBeVisible();
  
    // Add new card
    await page.getByRole('button', { name: 'Add new card Add a credit or' }).click();
    await page.getByLabel('Name *').fill('John Doe');
    await page.getByLabel('Card Number *').fill('4111111111111111');
    await page.locator('select').nth(0).selectOption('1');
    await page.locator('select').nth(1).selectOption('2080');
    await page.getByRole('button', { name: 'send Submit' }).click();
  
    // Complete purchase
    await page.locator('mat-radio-button').first().click();
    await page.getByLabel('Proceed to review').click();
    await page.getByLabel('Complete your purchase').click();
});