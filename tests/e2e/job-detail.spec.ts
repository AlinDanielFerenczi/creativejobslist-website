import { test, expect } from '@playwright/test'
import { mockJobs } from './fixtures'

const job = mockJobs[0]

test.describe('Job detail page', () => {
  test('renders job details when found', async ({ page }) => {
    await page.route(`**/api/jobs/${job.id}`, route =>
      route.fulfill({ json: job })
    )

    await page.goto(`/jobs/${job.id}`)
    await expect(page.getByRole('heading', { name: job.title })).toBeVisible()
    await expect(page.getByText(job.companyName).first()).toBeVisible()
    await expect(page.getByText(job.location).first()).toBeVisible()
    await expect(page.getByText('Remote Accepted')).toBeVisible()
  })

  test('shows salary range', async ({ page }) => {
    await page.route(`**/api/jobs/${job.id}`, route =>
      route.fulfill({ json: job })
    )

    await page.goto(`/jobs/${job.id}`)
    await expect(page.getByText('$120k - $180k USD')).toBeVisible()
  })

  test('shows job description', async ({ page }) => {
    await page.route(`**/api/jobs/${job.id}`, route =>
      route.fulfill({ json: job })
    )

    await page.goto(`/jobs/${job.id}`)
    await expect(page.getByText('Job Description')).toBeVisible()
    await expect(page.getByText(/looking for a Senior Product Designer/i)).toBeVisible()
  })

  test('shows skill tags', async ({ page }) => {
    await page.route(`**/api/jobs/${job.id}`, route =>
      route.fulfill({ json: job })
    )

    await page.goto(`/jobs/${job.id}`)
    await expect(page.getByText('Required Skills')).toBeVisible()
    const skillsSection = page.locator('.flex.flex-wrap.gap-2')
    for (const tag of job.tags) {
      await expect(skillsSection.getByText(tag, { exact: true })).toBeVisible()
    }
  })

  test('shows Apply Now and Save Job buttons', async ({ page }) => {
    await page.route(`**/api/jobs/${job.id}`, route =>
      route.fulfill({ json: job })
    )

    await page.goto(`/jobs/${job.id}`)
    await expect(page.getByRole('button', { name: 'Apply Now' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save Job' })).toBeVisible()
  })

  test('shows email subscription form', async ({ page }) => {
    await page.route(`**/api/jobs/${job.id}`, route =>
      route.fulfill({ json: job })
    )

    await page.goto(`/jobs/${job.id}`)
    await expect(page.getByText('Get alerts for similar jobs')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Subscribe' })).toBeVisible()
  })

  test('shows share buttons', async ({ page }) => {
    await page.route(`**/api/jobs/${job.id}`, route =>
      route.fulfill({ json: job })
    )

    await page.goto(`/jobs/${job.id}`)
    await expect(page.getByText('Share this role')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible()
  })

  test('shows not found for invalid job ID', async ({ page }) => {
    await page.route('**/api/jobs/nonexistent', route =>
      route.fulfill({ status: 404, json: { statusCode: 404, statusMessage: 'Not found' } })
    )

    await page.goto('/jobs/nonexistent')
    await expect(page.getByText('Job not found')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to Jobs' })).toBeVisible()
  })
})
