import { test, expect } from '@playwright/test'
import { mockJobs } from './fixtures'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/jobs', route =>
    route.fulfill({ json: mockJobs })
  )
})

test.describe('Homepage', () => {
  test('renders hero section with search', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /find your next/i })).toBeVisible()
    await expect(page.getByPlaceholder(/search for job titles/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search Jobs' })).toBeVisible()
  })

  test('displays job listings from API', async ({ page }) => {
    await page.goto('/')
    const jobList = page.locator('.space-y-4')
    await expect(jobList.getByText('Senior Product Designer')).toBeVisible()
    await expect(jobList.getByText('Motion Graphics Artist')).toBeVisible()
    await expect(jobList.getByText('Illustrator')).toBeVisible()
  })

  test('shows company names on job cards', async ({ page }) => {
    await page.goto('/')
    const jobList = page.locator('.space-y-4')
    await expect(jobList.getByText('Figma').first()).toBeVisible()
    await expect(jobList.getByText('Netflix').first()).toBeVisible()
    await expect(jobList.getByText('Dropbox').first()).toBeVisible()
  })

  test('search filters jobs by title', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder(/search for job titles/i).fill('Designer')
    await expect(page.getByText('Senior Product Designer')).toBeVisible()
    await expect(page.getByText('Motion Graphics Artist')).not.toBeVisible()
  })

  test('search filters jobs by company', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder(/search for job titles/i).fill('Netflix')
    await expect(page.getByText('Motion Graphics Artist')).toBeVisible()
    await expect(page.getByText('Senior Product Designer')).not.toBeVisible()
  })

  test('remote filter shows only remote jobs', async ({ page }) => {
    await page.goto('/')
    const jobList = page.locator('.space-y-4')
    await page.getByLabel('Remote Only').check()
    await expect(jobList.getByText('Senior Product Designer')).toBeVisible()
    await expect(jobList.getByText('Illustrator')).toBeVisible()
    await expect(jobList.getByText('Motion Graphics Artist')).not.toBeVisible()
  })

  test('shows empty state when no jobs match', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder(/search for job titles/i).fill('xyznonexistent')
    await expect(page.getByText('No jobs found')).toBeVisible()
  })

  test('filter controls are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByLabel('Remote Only')).toBeVisible()
    await expect(page.getByPlaceholder('Location...')).toBeVisible()
    await expect(page.getByText('Sort by:')).toBeVisible()
  })

  test('job cards link to detail page', async ({ page }) => {
    await page.goto('/')
    const link = page.getByRole('link', { name: /Senior Product Designer/i })
    await expect(link).toHaveAttribute('href', `/jobs/${mockJobs[0].id}`)
  })
})
