import { test, expect } from '@playwright/test'

test.describe('Post a Job page', () => {
  test('renders all form fields', async ({ page }) => {
    await page.goto('/post')
    await expect(page.getByRole('heading', { name: /reach the world/i })).toBeVisible()
    await expect(page.getByText('Job Details')).toBeVisible()
    await expect(page.getByPlaceholder('e.g. Senior Product Designer')).toBeVisible()
    await expect(page.getByPlaceholder('e.g. Figma')).toBeVisible()
    await expect(page.getByPlaceholder('e.g. San Francisco, CA')).toBeVisible()
    await expect(page.getByLabel(/this job accepts remote/i)).toBeVisible()
    await expect(page.getByPlaceholder('e.g. 100000')).toBeVisible()
    await expect(page.getByPlaceholder('e.g. 150000')).toBeVisible()
    await expect(page.getByPlaceholder(/e.g. UI, UX/i)).toBeVisible()
    await expect(page.getByPlaceholder(/describe the role/i)).toBeVisible()
  })

  test('shows $299 pricing and payment section', async ({ page }) => {
    await page.goto('/post')
    await expect(page.getByText('$299')).toBeVisible()
    await expect(page.getByText('Standard Listing')).toBeVisible()
    await expect(page.getByText(/valid for 30 days/i)).toBeVisible()
    await expect(page.getByText(/secured by stripe/i)).toBeVisible()
  })

  test('has Post & Pay submit button', async ({ page }) => {
    await page.goto('/post')
    await expect(page.getByRole('button', { name: /post & pay/i })).toBeVisible()
  })

  test('form fields are fillable', async ({ page }) => {
    await page.goto('/post')
    await page.getByPlaceholder('e.g. Senior Product Designer').fill('Test Job Title')
    await page.getByPlaceholder('e.g. Figma').fill('Test Company')
    await page.getByPlaceholder('e.g. San Francisco, CA').fill('New York, NY')
    await page.getByLabel(/this job accepts remote/i).check()
    await page.getByPlaceholder(/describe the role/i).fill('This is a test description.')

    await expect(page.getByPlaceholder('e.g. Senior Product Designer')).toHaveValue('Test Job Title')
    await expect(page.getByPlaceholder('e.g. Figma')).toHaveValue('Test Company')
    await expect(page.getByLabel(/this job accepts remote/i)).toBeChecked()
  })

  test('submit triggers checkout API call', async ({ page }) => {
    await page.route('**/api/checkout', route =>
      route.fulfill({ json: { url: null, message: 'Stripe not configured' } })
    )

    await page.goto('/post')
    await page.getByPlaceholder('e.g. Senior Product Designer').fill('Test Job')
    await page.getByPlaceholder('e.g. Figma').fill('Test Co')
    await page.getByPlaceholder('e.g. San Francisco, CA').fill('Remote')
    await page.getByPlaceholder(/describe the role/i).fill('Test description')

    page.on('dialog', dialog => dialog.accept())

    const [request] = await Promise.all([
      page.waitForRequest('**/api/checkout'),
      page.getByRole('button', { name: /post & pay/i }).click()
    ])

    expect(request.method()).toBe('POST')
  })
})
