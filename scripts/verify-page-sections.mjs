import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  });
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:8080/ ...');
  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Verify Shop Page
  console.log('--- 1. Testing Shop Page ---');
  const shopData = await page.evaluate(() => {
    const store = window.__editorStore;
    store.getState().switchPage('shop');
    const shopPage = store.getState().pages.shop;
    const sectionTypes = shopPage.sections.map((s) => s.type + (s.type === 'block' ? `:${s.kind}` : ''));
    return {
      sectionTypes,
      sectionNames: shopPage.sections.map((s) => s.name || s.type),
    };
  });
  console.log('Shop Page sections:', shopData);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/shop-page-clean.png', fullPage: true });

  const shopText = await page.evaluate(() => document.body.innerText);
  const shopHasBanner = shopData.sectionTypes.includes('banner');
  const shopHasReviews = shopData.sectionTypes.some((t) => t.includes('reviews'));
  const shopHasNewsletter = shopData.sectionTypes.some((t) => t.includes('newsletter'));
  console.log('Shop verification:', {
    hasBanner: shopHasBanner,
    hasReviews: shopHasReviews,
    hasNewsletter: shopHasNewsletter,
  });

  // 2. Verify Product Page
  console.log('--- 2. Testing Product Details Page ---');
  const productData = await page.evaluate(() => {
    const store = window.__editorStore;
    store.getState().switchPage('product');
    const prodPage = store.getState().pages.product;
    const sectionTypes = prodPage.sections.map((s) => s.type + (s.type === 'block' ? `:${s.kind}` : ''));
    return {
      sectionTypes,
      sectionNames: prodPage.sections.map((s) => s.name || s.type),
    };
  });
  console.log('Product Page sections:', productData);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/product-page-clean.png', fullPage: true });

  const prodHasBanner = productData.sectionTypes.includes('banner');
  const prodHasReviews = productData.sectionTypes.some((t) => t.includes('reviews'));
  const prodHasNewsletter = productData.sectionTypes.some((t) => t.includes('newsletter'));
  console.log('Product verification:', {
    hasBanner: prodHasBanner,
    hasReviews: prodHasReviews,
    hasNewsletter: prodHasNewsletter,
  });

  // Verify Add Sheet items for shop and product
  console.log('--- 3. Testing Add Section items ---');
  await page.evaluate(() => {
    window.__editorStore.getState().switchPage('shop');
    window.__editorStore.getState().openSheet('add');
  });
  await page.waitForTimeout(500);
  const shopAddItems = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasCatalog: text.includes('Catalog Grid'),
      hasBanner: text.includes('Promo Banner'),
      hasReviews: text.includes('Customer Reviews'),
      hasNewsletter: text.includes('Newsletter'),
    };
  });
  console.log('Add Section on Shop page:', shopAddItems);

  await page.evaluate(() => {
    window.__editorStore.getState().switchPage('product');
    window.__editorStore.getState().openSheet('add');
  });
  await page.waitForTimeout(500);
  const productAddItems = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasProduct: text.includes('Product Details'),
      hasRelated: text.includes('Related Products'),
      hasGuarantees: text.includes('Trust & Guarantees'),
      hasBanner: text.includes('Promo Banner'),
      hasReviews: text.includes('Customer Reviews'),
      hasNewsletter: text.includes('Newsletter'),
    };
  });
  console.log('Add Section on Product page:', productAddItems);

  await browser.close();
  console.log('Verification script completed!');
}

verify().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
