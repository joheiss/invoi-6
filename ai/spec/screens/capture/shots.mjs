import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const OUT = '/Users/joheiss/dev/projects/jovisco/ai/invoi-6/ai/spec/screens';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:4200';
const done = [], failed = [];
const browser = await chromium.launch();

async function session(role, email, fn) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const p = await ctx.newPage();
  const shot = async (name, opts = {}) => {
    await p.waitForTimeout(opts.wait ?? 1800);
    await p.screenshot({ path: `${OUT}/${role}-${name}.png`, fullPage: opts.full ?? false });
    done.push(`${role}-${name}`);
  };
  const go = async (path) => { if (role === 'anon') await p.goto(BASE + path); else await p.evaluate((x) => { window.history.pushState({}, '', x); window.dispatchEvent(new PopStateEvent('popstate')); }, path); };
  const step = async (name, f) => { try { await f(); } catch (e) { failed.push(`${role}-${name}: ${String(e.message).split('\n')[0].slice(0, 90)}`); } };
  const relogin = async () => { await login(p, email); };
  await fn({ p, shot, go, step, relogin });
  await ctx.close();
}

async function login(p, email) {
  await p.goto(BASE + '/auth/login');
  await p.fill('input[type=email]', email);
  await p.fill('input[type=password]', 'Test1234!');
  await p.click('button:has-text("Anmelden")');
  await p.waitForTimeout(3000);
}

// anonymous
await session('anon', '', async ({ p, shot, go, step, relogin }) => {
  await step('login', async () => { await go('/auth/login'); await shot('01-login'); });
  await step('login-invalid', async () => { await p.fill('input[type=email]', 'nobody@test.local'); await p.fill('input[type=password]', 'wrong-password'); await p.click('button:has-text("Anmelden")'); await shot('02-login-fail'); });
  await step('home', async () => { await go('/home'); await shot('03-home'); });
});

await session('sales', 'sales@test.local', async ({ p, shot, go, step, relogin }) => {
  await step('login', async () => { await login(p, 'sales@test.local'); await shot('01-after-login'); });
  await step('overview', async () => { await go('/invoicing'); await shot('02-overview', { wait: 3500, full: true }); });
  await step('receivers', async () => { await go('/invoicing/receivers'); await shot('03-receivers', { wait: 3000, full: true }); });
  await step('receiver', async () => { await go('/invoicing/receivers/1007'); await shot('04-receiver-details', { wait: 3000, full: true }); });
  await step('receiver-tabs', async () => { const tabs = p.locator('[role=tab]'); const n = await tabs.count(); for (let i = 1; i < n; i++) { await tabs.nth(i).click(); await shot(`04-receiver-tab${i}`, { wait: 1200, full: true }); } });
  await step('receiver-new', async () => { await go('/invoicing/receivers/new'); await shot('05-receiver-new', { wait: 2500, full: true }); });
  await step('receiver-unsaved', async () => { await relogin(); await go('/invoicing/receivers/1007'); await p.waitForTimeout(2500); await p.fill('input[formcontrolname=nameAdd]', 'Geaendert'); await p.waitForTimeout(800); await p.locator('a:visible:has-text("Verträge")').first().click(); await shot('06-unsaved-changes-dialog', { wait: 1200 }); await p.locator('button:has-text("Ja")').click(); await p.waitForTimeout(800); });
  await step('contracts', async () => { await go('/invoicing/contracts'); await shot('07-contracts', { wait: 3000, full: true }); });
  await step('contract', async () => { await go('/invoicing/contracts/4098'); await shot('08-contract-details', { wait: 3000, full: true }); });
  await step('contract-tabs', async () => { const tabs = p.locator('[role=tab]'); const n = await tabs.count(); for (let i = 1; i < n; i++) { await tabs.nth(i).click(); await shot(`08-contract-tab${i}`, { wait: 1200, full: true }); } });
  await step('contract-new', async () => { await go('/invoicing/contracts/new'); await shot('09-contract-new', { wait: 2500, full: true }); });
  await step('invoices', async () => { await go('/invoicing/invoices'); await shot('10-invoices', { wait: 3000, full: true }); });
  await step('invoice', async () => { await go('/invoicing/invoices/5152'); await shot('11-invoice-details', { wait: 3000, full: true }); });
  await step('invoice-tabs', async () => { const tabs = p.locator('[role=tab]'); const n = await tabs.count(); for (let i = 1; i < n; i++) { await tabs.nth(i).click(); await shot(`11-invoice-tab${i}`, { wait: 1200, full: true }); } });
  await step('invoice-new', async () => { await go('/invoicing/invoices/new'); await shot('12-invoice-new', { wait: 2500, full: true }); });
  await step('invoice-quick', async () => { await go('/invoicing/invoices/quick'); await shot('13-invoice-quick', { wait: 2500, full: true }); });
  await step('invoice-open', async () => { await relogin(); await go('/invoicing/invoices'); await p.waitForTimeout(2500); await p.locator('mat-card a:has-text("Details")').first().click(); await shot('14-invoice-from-list', { wait: 2500, full: true }); });
  await step('delete-dialog', async () => { await relogin(); await go('/invoicing/invoices'); await p.waitForTimeout(2500); await p.locator('mat-card button:has-text("Löschen")').first().click(); await shot('15-delete-confirmation', { wait: 1200 }); });
  await step('settings-forbidden', async () => { await go('/invoicing/settings'); await shot('16-settings-as-sales', { wait: 2500 }); });
  await step('users-forbidden', async () => { await go('/auth/users'); await shot('17-users-as-sales', { wait: 2500 }); });
  await step('confirmations', async () => { await go('/invoicing/confirmations'); await shot('18-confirmations', { wait: 2000 }); });
  await step('profile-menu', async () => { await relogin(); await p.locator('button:has-text("Test Vertrieb")').click(); await shot('18b-profile-menu', { wait: 1000 }); await p.keyboard.press('Escape'); });
  await step('logout', async () => { await relogin(); await p.locator('button:has(mat-icon:text("menu"))').first().click(); await p.waitForTimeout(800); await p.locator('a:has-text("Abmelden")').first().click(); await shot('19-logout', { wait: 1500 }); });
});

await session('admin', 'admin@test.local', async ({ p, shot, go, step, relogin }) => {
  await step('login', async () => { await login(p, 'admin@test.local'); await shot('01-after-login'); });
  await step('settings', async () => { await go('/invoicing/settings'); await shot('02-settings', { wait: 3000 }); });
  await step('countries', async () => { await go('/invoicing/settings/countries'); await shot('03-countries', { wait: 3000, full: true }); });
  await step('countries-dialog', async () => { await go('/invoicing/settings/countries'); await p.waitForTimeout(2500); await p.locator('button:has-text("Land hinzufügen")').click(); await shot('04-country-dialog-new', { wait: 1500 }); await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.locator('mat-row button:has(mat-icon:text("playlist_add"))').first().click(); await shot('04b-country-dialog-translate', { wait: 1500 }); await p.keyboard.press('Escape'); });
  await step('vats', async () => { await go('/invoicing/settings/vats'); await shot('05-vats', { wait: 3000, full: true }); });
  await step('vat-dialog', async () => { await go('/invoicing/settings/vats'); await p.waitForTimeout(2500); await p.locator('button:has-text("Steuersatz hinzufügen")').click(); await shot('06-vat-dialog-new', { wait: 1500 }); await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.locator('mat-row button:has(mat-icon:text("playlist_add"))').first().click(); await shot('06b-vat-dialog-period', { wait: 1500 }); await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.locator('mat-row a').first().click(); await shot('06c-vat-dialog-edit', { wait: 1500 }); await p.keyboard.press('Escape'); });
  await step('users', async () => { await go('/auth/users'); await shot('07-users', { wait: 3000, full: true }); });
  await step('user-dialog', async () => { await go('/auth/users'); await p.waitForTimeout(2500); await p.locator('mat-row').first().click(); await shot('08-user-dialog-edit', { wait: 1500 }); await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.locator('button:has-text("Benutzer hinzufügen")').click(); await shot('08b-user-dialog-new', { wait: 1500 }); await p.keyboard.press('Escape'); });
  await step('my-profile', async () => { await go('/invoicing'); await p.waitForTimeout(1500); await p.locator('button:has-text("Test Admin")').click(); await shot('08c-profile-menu', { wait: 1000 }); });
  await step('invoicing-as-admin', async () => { await go('/invoicing'); await shot('09-invoicing-as-admin', { wait: 3000 }); });
});

await session('auditor', 'auditor@test.local', async ({ p, shot, go, step, relogin }) => {
  await step('login', async () => { await login(p, 'auditor@test.local'); await shot('01-after-login'); });
  await step('overview', async () => { await go('/invoicing'); await shot('02-overview', { wait: 3500, full: true }); });
  await step('invoices', async () => { await go('/invoicing/invoices'); await shot('03-invoices', { wait: 3000, full: true }); });
  await step('invoice', async () => { await go('/invoicing/invoices/5152'); await shot('04-invoice-details', { wait: 3000, full: true }); });
});

await browser.close();
console.log('DONE', done.length, 'FAILED', failed.length); failed.forEach(f => console.log(' -', f));
