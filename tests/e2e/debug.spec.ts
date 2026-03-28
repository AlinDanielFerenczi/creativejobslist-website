import { test } from '@playwright/test'

test('debug: screenshot homepage', async ({ page }) => {
  const response = await page.goto('/')
  console.log('Status:', response?.status())
  console.log('URL:', page.url())
  const html = await page.content()
  console.log('HTML length:', html.length)
  console.log('HTML snippet:', html.substring(0, 2000))
  await page.screenshot({ path: 'test-results/debug-homepage.png', fullPage: true })
})
