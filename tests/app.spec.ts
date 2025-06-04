const { test, expect } = require('@playwright/test');


let config = {
    appUrl: 'https://org13abc74f.crm6.dynamics.com/main.aspx?appid=69816a96-2f9f-ee11-be37-6045bd3d402f',
    appName: 'Early Terminations Administration'
};

test.beforeAll(async () => {
});

test.afterAll(async () => {
});

test('open app', async ({ page }) => {
    await page.goto(config.appUrl);
    try {
        await page.getByText('Please sign in again', { exact: true }).waitFor({ timeout: 20000 });
        throw new Error('You need to log in again.');
    } catch (err) {
        if (!(err.name === 'TimeoutError'))
            throw err;
    }
    await expect(page.locator('text=${config.appName}').first()).toBeVisible();
});

test('check zero ETs', async ({ page }) => {
    await page.goto(config.appUrl);
    await expect(page.getByText('Rows:')).toBeVisible();
    await expect(page.getByText('Rows:')).toHaveText('Rows: 0');
});

test('check layout - new ET', async ({ page }) => {
    await page.goto(config.appUrl);

    await page.getByRole('menuitem', { name: 'New', exact: true }).click();
    await expect(page.getByRole('region', { name: 'StarRez' })).toBeVisible();
    await page.waitForLoadState('load');

    // check in 'ET Submission' process
    const processName = await page.evaluate(() => { return window.Xrm.Page.data.process.getActiveProcess().getName(); });
    expect(processName).toBe('ET Submission');

    await expect(page.getByRole('region', { name: 'StarRez' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'StarRez System' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'ANU EntryID' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'BookingID' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Student Details' })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Booking Details' })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Communications' })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Audit' })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Replacement Occupant' })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Residence Recommendation' })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Central Assessment' })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Director Approval' })).not.toBeVisible();
    await expect(page.getByRole('tab', { name: 'Notes & Comments' })).not.toBeVisible();
    await expect(page.getByRole('tab', { name: 'Attachments' })).not.toBeVisible();
    await expect(page.getByRole('tab', { name: 'Appeals' })).not.toBeVisible();
});

test('check layout - new ET - system ANU', async ({ page }) => {
    await page.goto(config.appUrl);

    await page.getByRole('menuitem', { name: 'New', exact: true }).click();
    await expect(page.getByRole('region', { name: 'StarRez' })).toBeVisible();
    await page.waitForLoadState('load');

    // check in 'ET Submission' process
    const processName = await page.evaluate(() => { return window.Xrm.Page.data.process.getActiveProcess().getName(); });
    expect(processName).toBe('ET Submission');

    await expect(page.getByRole('region', { name: 'StarRez' })).toBeVisible();
    await page.getByRole('combobox', { name: 'StarRez System' }).click();
    await page.getByRole('option', { name: 'UniLodge' }).click();
    await page.getByRole('combobox', { name: 'StarRez System' }).click();
    await page.getByRole('option', { name: 'ANU' }).click();
    await expect(page.getByRole('combobox', { name: 'StarRez System' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'ANU EntryID' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'External EntryID' })).not.toBeVisible();
    await expect(page.getByRole('textbox', { name: 'BookingID' })).toBeVisible();
});

test('check layout - new ET - system UniLodge', async ({ page }) => {
    await page.goto(config.appUrl);

    await page.getByRole('menuitem', { name: 'New', exact: true }).click();
    await expect(page.getByRole('region', { name: 'StarRez' })).toBeVisible();
    await page.waitForLoadState('load');

    // check in 'ET Submission' process
    const processName = await page.evaluate(() => { return window.Xrm.Page.data.process.getActiveProcess().getName(); });
    expect(processName).toBe('ET Submission');

    await expect(page.getByRole('region', { name: 'StarRez' })).toBeVisible();
    await page.getByRole('combobox', { name: 'StarRez System' }).click();
    await page.getByRole('option', { name: 'ANU' }).click();
    await page.getByRole('combobox', { name: 'StarRez System' }).click();
    await page.getByRole('option', { name: 'UniLodge' }).click();
    await expect(page.getByRole('combobox', { name: 'StarRez System' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'ANU EntryID' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'External EntryID' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'BookingID' })).toBeVisible();
});

test('create ANU ET', async ({ page }) => {
    await page.goto(config.appUrl);
    await expect(page.getByText('Rows:')).toHaveText('Rows: 0');

    await page.getByRole('menuitem', { name: 'New', exact: true }).click();
    await expect(page.getByRole('region', { name: 'StarRez' })).toBeVisible();
    const etIdDiv = page.locator('div').filter({ hasText: /^---ET ID$/ }).locator('div').first().elementHandle();
    await expect(etIdDiv?.textContent).toMatch(/^---ET ID$/);
    await page.getByRole('combobox', { name: 'StarRez System' }).click();
    await page.getByRole('option', { name: 'ANU' }).click();
    await page.getByRole('textbox', { name: 'ANU EntryID' }).fill('284623');
    await page.getByRole('textbox', { name: 'BookingID' }).fill('236560');
    await expect(page.getByRole('combobox', { name: 'StarRez System' })).toHaveText('ANU');
    await expect(page.getByRole('textbox', { name: 'ANU EntryID' })).toHaveValue('284623');
    await expect(page.getByRole('textbox', { name: 'BookingID' })).toHaveValue('236560');
    await page.getByRole('tab', { name: 'General' }).click();
    await page.getByText('Saving...', { exact: true }).waitFor({ timeout: 10000 });
    await expect(etIdDiv?.textContent).toMatch(/^ET-\d+$/);
    await page.waitForTimeout(10000);
});

