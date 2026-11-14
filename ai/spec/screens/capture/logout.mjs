import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 700, height: 900 }, locale: 'de-DE' }); const p = await ctx.newPage();
await p.goto('http://localhost:4200/auth/login'); await p.fill('input[type=email]','sales@test.local'); await p.fill('input[type=password]','Test1234!'); await p.click('button:has-text("Anmelden")'); await p.waitForTimeout(3000);
await p.locator('button:visible:has-text("menu")').first().click(); await p.waitForTimeout(1000);
await p.screenshot({ path: '/Users/joheiss/dev/projects/jovisco/ai/invoi-6/ai/spec/screens/sales-19a-sidebar-open.png' });
await p.locator('a:visible:has-text("Abmelden")').first().click(); await p.waitForTimeout(1500);
await p.screenshot({ path: '/Users/joheiss/dev/projects/jovisco/ai/invoi-6/ai/spec/screens/sales-19-logout.png' });
console.log(p.url());
await b.close();
