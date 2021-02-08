// @ts-ignore
import puppeteer from "puppeteer"

// @ts-ignore
import { secure, Browser, ElementHandle, SecurePage } from "isolated-world"
;(async () => {
  const browser: Browser = await puppeteer.launch()
  const page: SecurePage = secure(await browser.newPage())
  await page.goto("https://prescience-data.github.io/execution-monitor.html")
  const element: ElementHandle | null = await page.secure.$(".example-input")
  if (element) {
    await element.type("This is a test...", { delay: 8 })
  } else {
    throw new Error(`Could not find element ".example-input"`)
  }
})()
