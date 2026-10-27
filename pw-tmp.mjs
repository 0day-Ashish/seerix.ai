import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000", { waitUntil: "load" }); await p.waitForTimeout(3500);
await p.screenshot({ path: "/private/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad/hero-glow3.png" });
// The form must be the top element where it sits, not the glow.
const top = await p.evaluate(() => { const i=document.querySelector("#waitlist-email").getBoundingClientRect(); return document.elementFromPoint(i.x+20, i.y+10)?.id; });
console.log("on top at the input:", top);
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto("http://localhost:3000", { waitUntil: "load" }); await m.waitForTimeout(2500);
console.log("mobile overflow:", await m.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await m.screenshot({ path: "/private/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad/hero-glow-m.png" });
await b.close();
