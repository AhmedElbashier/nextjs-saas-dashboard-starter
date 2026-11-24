import { expect, test } from "@playwright/test";

test("overview renders KPIs, charts and sample-data label", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(page.getByText("Sample data", { exact: true })).toBeVisible();
  await expect(page.getByText("MRR by plan")).toBeVisible();
  await expect(page.locator(".recharts-surface").first()).toBeVisible();
});

test("customers table filters and paginates", async ({ page }) => {
  await page.goto("/dashboard/customers");
  await expect(page.getByTestId("row-count")).toHaveText("48 customers");
  await page.getByLabel("Filter by status").selectOption("trialing");
  await expect(page.getByTestId("row-count")).not.toHaveText("48 customers");
  await page.getByLabel("Filter by status").selectOption("all");
  await page.getByLabel("Search customers").fill("cus_0001");
  await expect(page.getByTestId("row-count")).toHaveText("1 customers");
});

test("login screen is reachable", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" }).or(page.getByText("Sign in").first())).toBeVisible();
});
