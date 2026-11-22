import { test, expect } from "@playwright/test";

test("SauceDemo: Successful login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { timeout: 60000 });
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator(".title")).toHaveText("Products");
  await expect(page.locator(".inventory_item")).toHaveCount(6);
});

test("SauceDemo: Visual check of the inventory page", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { timeout: 60000 });
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator(".title")).toHaveText("Products");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("saucedemo-products.png", {
    maxDiffPixels: 50000,
    threshold: 0.3,
    animations: "disabled",
  });
});

test("SauceDemo: Failed test for debug", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { timeout: 60000 });
  await expect(
    page.getByRole("button", { name: "Login", exact: true }),
  ).toBeVisible({
    timeout: 5000,
  });
});
