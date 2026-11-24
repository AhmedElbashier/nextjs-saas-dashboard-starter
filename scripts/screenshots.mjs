// Captures README screenshots from a running server (npm run build && npm start).
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const shots = [
  { path: "/dashboard", file: "overview.png", viewport: { width: 1440, height: 1000 } },
  { path: "/dashboard/customers", file: "customers.png", viewport: { width: 1440, height: 900 } },
  { path: "/login", file: "login.png", viewport: { width: 1280, height: 800 } },
  { path: "/dashboard", file: "overview-mobile.png", viewport: { width: 390, height: 844 } },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: 1 });
  await page.goto(base + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(800); // let chart animations settle
  await page.screenshot({ path: `docs/screenshots/${s.file}`, fullPage: true });
  console.log("saved", s.file);
  await page.close();
}
await browser.close();
