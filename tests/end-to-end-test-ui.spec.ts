import { test, expect } from "@playwright/test";

const parseMoney = (text: string) => {
  const cleaned = text.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned);
};

test("testing process from login to buying thing", async ({ page }) => {
  //открыть страницу
  await page.goto("https://www.saucedemo.com");
  //записать в переменные поля
  const usernameField = page.locator('[data-test="username"]');
  const passwordField = page.locator("#password");
  const loginBtn = page.locator("#login-button");
  //проверить поля
  await expect(page.locator(".login_logo")).toBeVisible();
  await expect(usernameField).toHaveValue("");
  await expect(passwordField).toHaveValue("");
  await expect(loginBtn).toBeVisible();
  //написать креды в поля
  await usernameField.fill("standard_user");
  await passwordField.fill("secret_sauce");
  await loginBtn.click();
  //проверить, что произошел переход на следующую страницу
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  //вынести первый блок с товаром в переменную
  const addToCartBtn = page
    .locator(".inventory_item")
    .first()
    .getByRole("button", { name: "Add to cart" });
  //добавить в корзину этот товар
  await addToCartBtn.click();
  //проверить, что у корзины появился маркер, что добавлен 1 товар
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  //проверить, что кнопка поменяла текст на Remove
  await expect(
    page
      .locator(".inventory_item")
      .first()
      .getByRole("button", { name: "Remove" }),
  ).toHaveText("Remove");
  //открыть корзину
  await page.locator(".shopping_cart_link").click();
  //проверить, что отображается страница корзины
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  //проверить по заголовку, что добавился товар, заголовок не пустой
  const title = page.locator('[data-test="inventory-item-name"]');
  await expect(title).not.toHaveText(/^\s*$/);
  await expect(title).toHaveText("Sauce Labs Backpack");
  //проверить, что количество = 1
  await expect(page.locator(".cart_quantity")).toHaveText("1");
  //проверить цену
  await expect(page.locator(".inventory_item_price")).toHaveText("$29.99");
  //нажать на кнопку checkout
  await page.locator("#checkout").click();
  //проверить, что произошел переход на 1 шаг
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html",
  );
  //сохранить поля на странице в переменные
  const firstNameField = page.locator("#first-name");
  const lastNameField = page.locator("#last-name");
  const postalCodeField = page.locator("#postal-code");
  const continueBtn = page.locator("#continue");
  //проверить, что эти поля пустые и кнопка присутствует
  await expect(firstNameField).toHaveValue("");
  await expect(lastNameField).toHaveValue("");
  await expect(postalCodeField).toHaveValue("");
  await expect(continueBtn).toBeVisible();
  //заполнить поля
  await firstNameField.fill("Name");
  await lastNameField.fill("Last Name");
  await postalCodeField.fill("123456");
  //нажать на кнопку продолжить
  await continueBtn.click();
  //проверить, что произошел переход на 2 шаг
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-two.html",
  );
  //проверить товар
  const cartItemName = page.locator(".inventory_item_name");
  await expect(cartItemName).not.toHaveText(/^\s*$/);
  await expect(cartItemName).toHaveText("Sauce Labs Backpack");
  //проверить, что количество = 1
  await expect(page.locator(".cart_quantity")).toHaveText("1");
  //проверить цену
  const price = page.locator(".inventory_item_price");
  await expect(price).toHaveText("$29.99");
  const priceNumber = parseMoney(await price.innerText());
  const tax = page.locator(".summary_tax_label");
  const taxPrice = parseMoney(await tax.innerText());
  const total = page.locator(".summary_total_label");
  const totalPrice = parseMoney(await total.innerText());

  await expect(taxPrice).toBeCloseTo(priceNumber * 0.08, 2);
  await expect(totalPrice).toBeCloseTo(priceNumber + taxPrice, 2);

  await page.locator("#finish").click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-complete.html",
  );
});
