import { chromium } from "playwright";
const S="/private/tmp/claude-501/-Users-ashishranjandas-seerix-ai/7c9fb46a-1fda-40a4-ad47-6a65887ea0e3/scratchpad/jam";
const b = await chromium.launch(); const errs=[];
for (const [w,h,n] of [[1440,1000,"mod"],[390,844,"modm"]]) {
const p = await b.newPage({ viewport: { width: w, height: h } });
p.on("pageerror", e => errs.push(e.message));
await p.goto("http://localhost:3000/pricing", { waitUntil: "load" }); await p.waitForTimeout(2500);
await p.evaluate(() => { const h=[...document.querySelectorAll("h2")].find(h=>/What every plan runs/.test(h.textContent)); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 90); }); await p.waitForTimeout(1500);
await p.screenshot({ path: S+"/"+n+".png" });
console.log(n,"overflow:", await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
}
console.log("errors:", errs); await b.close();
