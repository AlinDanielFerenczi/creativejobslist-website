import { test, expect } from '@playwright/test'
import { mockJobs } from './fixtures'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/jobs', route =>
    route.fulfill({ json: mockJobs })
  )
})

test.describe('Navigation', () => {
  test('header shows logo linking to home', async ({ page }) => {
    await page.goto('/')
    const logo = page.getByRole('link', { name: 'Creative Jobs List' })
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('header shows Post a Job button', async ({ page }) => {
    await page.goto('/')
    const postLink = page.getByRole('link', { name: /post a job/i })
    await expect(postLink).toBeVisible()
    await expect(postLink).toHaveAttribute('href', '/post')
  })

  test('header shows Log In when not authenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible()
  })

  test('footer shows copyright', async ({ page }) => {
    await page.goto('/')
    const year = new Date().getFullYear().toString()
    await expect(page.getByText(new RegExp(`© ${year} Creative Jobs List`))).toBeVisible()
  })

  test('logo navigates to homepage', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: 'Creative Jobs List' }).click()
    await expect(page).toHaveURL('/')
  })

  test('Post a Job navigates to post page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /post a job/i }).click()
    await expect(page).toHaveURL('/post')
  })

  test('Log In navigates to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /log in/i }).click()
    await expect(page).toHaveURL('/login')
  })
})
