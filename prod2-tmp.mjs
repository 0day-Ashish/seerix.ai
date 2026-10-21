import { chromium } from "playwright";
const S = "/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
for (const k of ["fix-list","this-week","rankings"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:3210/app/${k}`, { waitUntil: "load" });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${S}/app-${k}.png`, timeout: 60000 });
  await p.close();
}
await b.close();
