import { expect, test as setup, chromium, firefox, webkit } from '@playwright/test';
import type { Browser, BrowserContext } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;

var browserState = 'playwright/.auth/<browser>-user.json';

let config = {
    appUrl: 'https://org13abc74f.crm6.dynamics.com/main.aspx?appid=69816a96-2f9f-ee11-be37-6045bd3d402f',
    appName: 'Early Terminations Administration'
};

setup('authenticate', async () => {
    const browserName = setup.info().project.name.replace('setup-', '');

    if (browserName.endsWith('chromium')) {
        browser = await chromium.launch({ headless: false });
    } else if (browserName.endsWith('firefox')) {
        browser = await firefox.launch({ headless: false });
    } else if (browserName.endsWith('webkit')) {
        browser = await webkit.launch({ headless: false });
    } else {
        throw new Error(`Unsupported browser: ${browserName}`);
    }

    context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(config.appUrl);

    console.log('🕹️ Please log in manually. The browser will pause...');
    await page.pause();

    console.log('💾 Saving authentication state...');
    var storageStatePath = browserState.replace('<browser>', browserName);
    await context.storageState({ path: storageStatePath });

    await browser.close();
    console.log(`✅ Done! Auth state saved to ${storageStatePath}`);
});