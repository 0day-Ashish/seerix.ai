import { chromium } from "playwright";
const S = "/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
await p.goto("http://localhost:3210/app", { waitUntil: "load" });
await p.waitForTimeout(2500);
await p.screenshot({ path: `${S}/ov-noalerts.png`, timeout: 60000 });
// Open the bell to confirm the alerts still live there.
await p.getByRole("button", { name: /Notifications/ }).click();
await p.waitForTimeout(600);
await p.screenshot({ path: `${S}/ov-bell.png`, timeout: 60000 });
await p.close();

const c = await b.newPage({ viewport: { width: 1440, height: 950 } });
await c.goto("http://localhost:3210/app/competitors", { waitUntil: "load" });
await c.waitForTimeout(3000);
await c.screenshot({ path: `${S}/comp-chart.png`, timeout: 60000, fullPage: true });
await b.close();
