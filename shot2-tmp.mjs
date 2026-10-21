import { chromium } from "playwright";
const S = "/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 1150 } });
await p.goto("http://localhost:3210", { waitUntil: "load" });
await p.waitForTimeout(7200);
await p.screenshot({ path: `${S}/chat-answer2.png`, timeout: 60000 });
await b.close();
