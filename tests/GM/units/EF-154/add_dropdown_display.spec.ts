import { test, expect } from "@playwright/test";
import { Selectors } from "./Selectors";
import { URLs, screenSize } from "../../../../constants/links";

test("EF-153_add_dropdown_display", async ({ page }) => {
  await page.setViewportSize(screenSize);

  await page.goto(URLs.login);
  
  await page.waitForSelector(Selectors.unitsBlock, {
    state: "attached",
    timeout: 10000,
  });

  const visibleRowCount = await page
    .locator(Selectors.trUnitsBlock)
    .filter({ has: page.locator(":visible") })
    .count();
  console.log(`Visible Rows: ${visibleRowCount}`);

  const randomIndex = Math.floor(Math.random() * visibleRowCount);

  const visibleRow = page
    .locator(Selectors.trUnitsBlock)
    .filter({ has: page.locator(":visible") })
    .nth(randomIndex);

  await visibleRow.scrollIntoViewIfNeeded();
  await page.addStyleTag({
    content: `
    ${Selectors.trUnitsBlock} {
      background-color: lightblue; 
      border: 1px solid #ccc;      
    }
  `,
  });
  await visibleRow.click();
  await page.waitForTimeout(2000);

  const unitUrl = await page.url();
  const unitId = unitUrl.match(/units\/([0-9a-fA-F-]+)$/)?.[1];

  console.log(`Extracted Unit ID: ${unitId}`);
  console.log(`Clicked on visible row index: ${randomIndex}`);

  await page.waitForSelector(Selectors.detailsBlock, { state: "visible" });
  await page.addStyleTag({
    content: `
      ${Selectors.detailsBlock} {
        background-color: lightblue; 
        border: 1px solid #ccc;      
      }
    `,
  });
  page.locator(Selectors.detailsBlock).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await expect(page.locator(Selectors.addUnitBtn).nth(1)).toHaveText("Add");
  await page.locator(Selectors.addUnitBtn).nth(1).click();

  await expect(page.locator(Selectors.addUnitDrdown)).toBeVisible();
  await page.addStyleTag({
    content: `
        ${Selectors.addUnitDrdown} {
          background-color: lightblue; 
          border: 1px solid #ccc;      
        }
      `,
  });
});
