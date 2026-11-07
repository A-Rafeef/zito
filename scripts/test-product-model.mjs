import { chromium } from 'playwright';
import fs from 'node:fs';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  });
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:8080/ ...');
  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Check Storefront Cards
  console.log('1. Checking Storefront Cards...');
  await page.screenshot({ path: 'screenshots/1-storefront-cards.png' });

  // Check that no review or rating text is in the card
  const cardHasReviews = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('reviews') || text.includes('128 reviews');
  });
  console.log('Any card with reviews?', cardHasReviews ? 'YES' : 'NO (CORRECT: removed)');

  // 2. Switch to Preview mode via store and open product
  console.log('2. Opening Product Details Page in Preview Mode...');
  await page.evaluate(() => {
    const store = window.__editorStore;
    if (store) {
      store.getState().togglePreview(true);
    }
  });
  await page.waitForTimeout(500);

  // Click on the product card
  const productCard = page.locator('text=Air Retro Court').first();
  await productCard.click();
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'screenshots/2-product-detail-page.png' });
  console.log('Saved screenshots/2-product-detail-page.png');

  // Verify elements on Product Details Page
  const detailsData = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasBrand: text.includes('Nike'),
      hasInStock: text.includes('In Stock'),
      hasDiscountBadge: text.includes('OFF'),
      hasColorLabel: text.includes('Select Color'),
      hasSizeLabel: text.includes('Select Size'),
      hasWhatsAppCTA: text.includes('Buy on WhatsApp'),
    };
  });
  console.log('Product Details Verification:', detailsData);

  // Click on size "US 10" which has +₹100 delta (or +$15)
  const size10 = page.locator('button:has-text("US 10")').first();
  if (await size10.isVisible()) {
    console.log('Clicking US 10 size pill...');
    await size10.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/3-size-delta-selected.png' });
    console.log('Saved screenshots/3-size-delta-selected.png');
  }

  // Click on second photo in thumbnail strip to test gallery
  const thumbs = page.locator('button[aria-label="Show photo"]');
  const thumbCount = await thumbs.count();
  console.log(`Found ${thumbCount} gallery thumbnails`);
  if (thumbCount > 1) {
    console.log('Clicking second thumbnail...');
    await thumbs.nth(1).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/4-gallery-thumb-switched.png' });
    console.log('Saved screenshots/4-gallery-thumb-switched.png');
  }

  // 3. Switch back to edit mode and test Product Card Studio (1 View & 2 View)
  console.log('3. Testing Product Card Studio...');
  await page.evaluate(() => {
    const store = window.__editorStore;
    if (store) {
      store.getState().togglePreview(false);
      store.getState().switchPage('home');
      store.getState().select('product-card');
    }
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'screenshots/5-studio-1-view.png' });
  console.log('Saved screenshots/5-studio-1-view.png');

  // Click 2 View
  const twoViewBtn = page.locator('button:has-text("2 View")').first();
  if (await twoViewBtn.isVisible()) {
    await twoViewBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/6-studio-2-view.png' });
    console.log('Saved screenshots/6-studio-2-view.png');
  }

  // Check studio card text to ensure NO reviews/ratings are present in studio
  const studioHasReviews = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('reviews') || text.includes('128 reviews');
  });
  console.log('Any reviews in Product Card Studio?', studioHasReviews ? 'YES' : 'NO (CORRECT: removed)');

  await browser.close();
  console.log('All tests finished successfully!');
}

run().catch((e) => {
  console.error('Error running test:', e);
  process.exit(1);
});
