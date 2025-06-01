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
    // const page = await context.newPage();
    await page.goto(config.appUrl);
    await expect(page.locator(`text=${config.appName}`).first()).toBeVisible();
});

