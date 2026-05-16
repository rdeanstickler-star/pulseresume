import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

/**
 * End-to-end smoke test that exercises the full user journey:
 *   1. Launch the SPA
 *   2. Open the editor
 *   3. Load the developer seed
 *   4. Edit basics.name
 *   5. Switch the template from Classic to Technical
 *   6. Trigger PDF export
 *   7. Assert the downloaded PDF file has non-zero size
 *
 * This is the load-bearing test for "the whole thing works in a real
 * browser". Unit tests cover individual pieces; this one catches anything
 * a real integration would surface.
 */

test('launch → seed → edit → switch template → export PDF', async ({ page }) => {
  // Capture downloads so we can inspect the PDF blob.
  const downloadsDir = test.info().outputPath('downloads');
  fs.mkdirSync(downloadsDir, { recursive: true });

  await page.goto('/');
  await expect(page).toHaveTitle(/PulseResume/);

  // Navigate to the editor.
  await page
    .getByRole('link', { name: /Start building/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/editor/);

  // Wait for the editor shell to render.
  await expect(page.getByRole('heading', { name: 'Basics' })).toBeVisible();

  // Load the developer seed.
  await page.getByRole('combobox', { name: /Load an example resume/i }).click();
  await page.getByRole('option', { name: /Staff Software Engineer/ }).click();

  // The basics.name field should now show "Avery Chen".
  const nameField = page.getByLabel('Full name');
  await expect(nameField).toHaveValue(/Avery/);

  // Edit basics.name — clear and type a custom value.
  await nameField.fill('Playwright Smoke');
  // Wait a tick longer than the 120ms debounce so the store commits.
  await page.waitForTimeout(180);
  await expect(nameField).toHaveValue('Playwright Smoke');

  // Switch template Classic → Technical via the template picker.
  await page.getByRole('combobox', { name: /Resume template/i }).click();
  await page.getByRole('option', { name: /Technical/ }).click();

  // Wait for preview to reflect the template change. Technical wraps section
  // names in `[ ... ]` markers; text is sentence-cased in the model and
  // visually uppercased via CSS, so we match case-insensitive.
  await expect(page.getByText(/\[\s*Experience\s*\]/i)).toBeVisible({ timeout: 5000 });

  // Trigger PDF export via the Export dropdown.
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export menu/i }).click();
  await page.getByRole('menuitem', { name: /^PDF/i }).click();
  const download = await downloadPromise;

  const savedPath = path.join(downloadsDir, download.suggestedFilename());
  await download.saveAs(savedPath);
  const stats = fs.statSync(savedPath);

  // Filename should slug from the new name.
  expect(download.suggestedFilename()).toMatch(/playwright-smoke-resume\.pdf$/i);
  // The PDF should have meaningful size (a Resume PDF with fonts is ~50–500 KB).
  expect(stats.size).toBeGreaterThan(10_000);

  // Sanity-check the first bytes — every PDF starts with "%PDF-".
  const head = fs.readFileSync(savedPath).subarray(0, 5).toString('ascii');
  expect(head).toBe('%PDF-');
});
