import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test('renders sign-in form by default', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByText('Sign in to access your dashboard')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('toggles to sign-up mode', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    await expect(page.getByText('Join Creative Jobs List to manage your jobs')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign up', exact: false })).toBeVisible()
  })

  test('toggles back to sign-in mode', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('email and password fields are required', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.getByPlaceholder('you@example.com')
    const passwordInput = page.getByPlaceholder('••••••••')
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })
})
