import { chromium } from "playwright";
const S = "/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1280, height: 760 } });
await p.goto("http://localhost:3210", { waitUntil: "load" });
const panel = p.locator("section").first().locator("div[aria-hidden=true]").last();
// Loop ≈ 1700 + 44*55 + 7600 ≈ 11.7s. Sample across it.
for (const [name, at] of [["a-rest",600],["b-zoom",1400],["c-typed",4600],["d-answer",6200],["e-push",8200],["f-reset",11000]]) {
  await p.waitForTimeout(at - (Number(p._last) || 0));
  p._last = at;
  await panel.screenshot({ path: `${S}/seq-${name}.png`, timeout: 60000 }).catch(()=>{});
}
await b.close();
