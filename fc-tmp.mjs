import { chromium } from "playwright";
const S = "/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto("http://localhost:3210/app/fix-list", { waitUntil: "load" });
await p.waitForTimeout(2400);
const box = await p.evaluate(() => {
  const g = document.querySelector("main .grid");
  const r = g.getBoundingClientRect();
  return { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 };
});
await p.screenshot({ path: `${S}/fc.png`, clip: box, timeout: 60000 });
await b.close();
