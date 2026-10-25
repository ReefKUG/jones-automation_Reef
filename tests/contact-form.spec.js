const { test, expect } = require('@playwright/test');

const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '0501234567',
    company: 'Acme Ltd',
    website: 'https://example.com',
    employees: '51-500',
    invalidMail: 'invalidMail.com',
    invalidWebsite: 'example.com',
};

//happy path 
test.describe('Contact form', () => {
    test('should submit the form and reach the thank-you page', async ({ page }) => {

        // Arrange
        await page.goto('/');

        // Act
        await page.getByLabel('Name *').fill(testData.name);
        await page.getByLabel('Email *').fill(testData.email);
        await page.getByLabel('Phone *').fill(testData.phone);
        await page.getByLabel('Company').fill(testData.company);
        await page.getByLabel('Website').fill(testData.website);
        await page.getByLabel('Number of Employees').selectOption(testData.employees);
        await page.screenshot({ path: 'screenshots/before-submit.png', fullPage: true });
        await page.getByRole('button', { name: 'Request a call back' }).click();

        // Assert & Log
        await expect(page).toHaveURL(/thank-you\.html/);

        const currentUrl = new URL(page.url());
        const urlParams = currentUrl.searchParams;

        expect(urlParams.get('name')).toBe(testData.name);
        expect(urlParams.get('email')).toBe(testData.email);
        expect(urlParams.get('phone')).toBe(testData.phone);
        expect(urlParams.get('company')).toBe(testData.company);
        expect(urlParams.get('website')).toBe(testData.website);
        expect(urlParams.get('number_of_employees')).toBe(testData.employees);

        await expect(page.getByRole('heading', { name: 'Thank You!', exact: true })).toBeVisible();
        console.log('Successfully reached the thank you page.');

    });
});

//edge cases
test.describe('Form edge cases', () => {
    //Arrange
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    //Act
    test('should not submit when name is empty', async ({ page }) => {
        await page.getByLabel('Email *').fill(testData.email);
        await page.getByLabel('Phone *').fill(testData.phone);
        await page.getByRole('button', { name: 'Request a call back' }).click();
        const isMissing = await page.getByLabel('Name *').evaluate((el) => el.validity.valueMissing);

        //Assert
        expect(isMissing).toBe(true);
        await expect(page).not.toHaveURL(/thank-you\.html/);
    })

    //Act
    test('should not submit when email is empty', async ({ page }) => {
        await page.getByLabel('Name *').fill(testData.name);
        await page.getByLabel('Phone *').fill(testData.phone);
        await page.getByRole('button', { name: 'Request a call back' }).click();
        const isMissing = await page.getByLabel('Email *').evaluate((el) => el.validity.valueMissing);

        //Assert
        expect(isMissing).toBe(true);
        await expect(page).not.toHaveURL(/thank-you\.html/);
    })

    //Act
    test('should not submit when phone is empty', async ({ page }) => {
        await page.getByLabel('Name *').fill(testData.name);
        await page.getByLabel('Email *').fill(testData.email);
        await page.getByRole('button', { name: 'Request a call back' }).click();
        const isMissing = await page.getByLabel('Phone *').evaluate((el) => el.validity.valueMissing);

        //Assert
        expect(isMissing).toBe(true);
        await expect(page).not.toHaveURL(/thank-you\.html/);
    })


    test('should not submit when email format is invalid', async ({ page }) => {
        const emailField = page.getByLabel('Email *');

        await page.getByLabel('Name *').fill(testData.name);
        await emailField.fill(testData.invalidMail);
        await page.getByLabel('Phone *').fill(testData.phone);
        await page.getByRole('button', { name: 'Request a call back' }).click();

        await expect(page).not.toHaveURL(/thank-you\.html/);

        const validationMessage = await emailField.evaluate((el) => el.validationMessage);
        expect(validationMessage).toMatch(/.+/);

        const isTypeMismatch = await emailField.evaluate((el) => el.validity.typeMismatch);
        expect(isTypeMismatch).toBe(true);

    })

    test('should not submit when website format is invalid', async ({ page }) => {
        const websiteField = page.getByLabel('Website');

        await page.getByLabel('Name *').fill(testData.name);
        await page.getByLabel('Email *').fill(testData.email);
        await page.getByLabel('Phone *').fill(testData.phone);
        await websiteField.fill(testData.invalidWebsite);
        await page.getByRole('button', { name: 'Request a call back' }).click();

        await expect(page).not.toHaveURL(/thank-you\.html/);

        const validationMessage = await websiteField.evaluate((el) => el.validationMessage);
        expect(validationMessage).toMatch(/.+/);

        const isTypeMismatch = await websiteField.evaluate((el) => el.validity.typeMismatch);
        expect(isTypeMismatch).toBe(true);
    });

    test('should submit when optional fields are empty', async ({ page }) => {
        
        await page.getByLabel('Name *').fill(testData.name);
        await page.getByLabel('Email *').fill(testData.email);
        await page.getByLabel('Phone *').fill(testData.phone);
        await page.getByRole('button', { name: 'Request a call back' }).click();

        await expect(page).toHaveURL(/thank-you\.html/);

        const urlParams = new URL(page.url()).searchParams;
        expect(urlParams.get('company')).toBe('');
        expect(urlParams.get('website')).toBe('');
    });

 
})