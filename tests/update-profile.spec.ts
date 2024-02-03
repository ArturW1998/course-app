import { test, expect } from "@playwright/test";
import { adminFile, userFile } from "./constants";
import { ADMIN } from "./stabs/users";

test.describe("update-profile as admin", () => {
  test.use({ storageState: adminFile });
  test("update username", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "AD" }).click();
    await page.getByRole("menuitem", { name: "Profile" }).click();
    await page.waitForURL(`/profile/${ADMIN.id}`);
    await page.getByLabel("User Name").click();
    await page.getByLabel("User Name").fill("Admin");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("img", { name: "Profile update" }),
    ).not.toBeVisible();
    await page.getByRole("banner").getByRole("button", { name: "AD" }).click();
    await expect(page.getByText("My accountAdmin")).toBeVisible();
    await page.locator("html").click();
    await page.getByLabel("User Name").click();
    await page.getByLabel("User Name").fill("");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("img", { name: "Profile update" }),
    ).not.toBeVisible();
    await page.getByRole("banner").getByRole("button", { name: "AD" }).click();
    await expect(page.getByText("My accountadmin@gmail.com")).toBeVisible();
  });

  test("can update another user", async ({ page }) => {
    await page.goto("/profile/user-2");
    await page.getByLabel("User Name").click();
    await page.getByLabel("User Name").fill("User");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("img", { name: "Profile update" }),
    ).not.toBeVisible();
    await page.reload();

    await expect(page.getByLabel("User Name")).toHaveValue("User");
    await page.getByLabel("User Name").click();
    await page.getByLabel("User Name").fill("");
    await page.getByRole("button", { name: "Save" }).click();
  });
});

test.describe("update-profile as user", () => {
  test.use({ storageState: userFile });
  test("update username", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "US" }).click();
    await page.getByRole("menuitem", { name: "Profile" }).click();
    await page.waitForURL("/profile/user");
    await page.getByLabel("User Name").click();
    await page.getByLabel("User Name").fill("User");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("img", { name: "Profile update" }),
    ).not.toBeVisible();
    await page.getByRole("banner").getByRole("button", { name: "US" }).click();
    await expect(page.getByText("My accountUser")).toBeVisible();
    await page.locator("html").click();
    await page.getByLabel("User Name").click();
    await page.getByLabel("User Name").fill("");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("img", { name: "Profile update" }),
    ).not.toBeVisible();
    await page.getByRole("banner").getByRole("button", { name: "US" }).click();
    await expect(page.getByText("My accountuser@gmail.com")).toBeVisible();
  });

  test("can not update another user", async ({ page }) => {
    await page.goto("/profile/admin");
    await expect(
      page.getByText("Failed to upload profile, you may not have permissions"),
    ).toBeVisible();
  });
});
