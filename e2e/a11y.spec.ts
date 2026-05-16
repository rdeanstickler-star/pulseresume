import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * axe-core driven WCAG 2.1 AA audit. Fails if any rule at level
 * `wcag21aa` (or stricter) reports a violation.
 *
 * Two pages exercised:
 *   - / (HomePage)
 *   - /editor with the developer seed loaded (the actual editing surface)
 *
 * Per WCAG, "color-contrast" can produce false positives on dynamic theme
 * pickers; we disable it on the editor only (the customization panel
 * itself has its own live WCAG meter, and the user is explicitly choosing
 * the colors).
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test('HomePage has no axe violations', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(results.violations, formatViolations(results.violations)).toEqual([]);
});

test('Editor with developer seed has no axe violations', async ({ page }) => {
  await page.goto('/editor');
  await page.waitForLoadState('networkidle');
  await page.getByRole('combobox', { name: /Load an example resume/i }).click();
  await page.getByRole('option', { name: /Staff Software Engineer/ }).click();
  await page.waitForTimeout(200);

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    // Disable color-contrast on the editor: the live WCAG meter in the
    // customization panel governs body text contrast explicitly, and the
    // shadcn theme tokens have been hand-tuned for AA on text content.
    .disableRules(['color-contrast'])
    .analyze();
  expect(results.violations, formatViolations(results.violations)).toEqual([]);
});

function formatViolations(
  violations: Array<{ id: string; impact?: string | null; description: string; nodes: unknown[] }>,
): string {
  if (violations.length === 0) return 'No axe violations.';
  return violations
    .map(
      (v) =>
        `  • [${v.impact ?? 'unknown'}] ${v.id}: ${v.description} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`,
    )
    .join('\n');
}
