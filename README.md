# Isolated World Accessor for Puppeteer

![image](https://media1.tenor.com/images/216d474ee4dcc7ff390d6053ae3f77cb/tenor.gif?itemid=4964881)


## Abstract

The goal is to provided clean, optional access to Puppeteer's internal `_secondaryWorld`.

My prior solution to this was fully isolating all execution by patching the concrete Puppeteer library, which you can find here: [Harden Puppeteer](https://github.com/prescience-data/harden-puppeteer)

A full global patch remains my preferred method as it catch anything Puppeteer may execute in the background, but there are many scenarios where a full patch isn't viable or required.

This package provides a way to access the internal `_secondaryWorld` which Puppeteer automatically isolates each context change.


## Installation

Install the `secure-puppeteer` package with `npm`, `yarn`, or `pnpm`.

```bash
$ npm install secure-puppeteer
```

#### Option 1 - Inject isolation into a new page:
```typescript
import { secure, SecurePage } from "secure-puppeteer"

const page: SecurePage = secure(await browser.newPage())
```

#### Option 2 - Access the isolation manager directly.

```typescript
import { isolate, IsolationManager } from "secure-puppeteer"

const iso: IsolationManager = isolate(await browser.newPage())
// Option 2(b) - Fully extract isolated world:
const { world } = iso.modules()
```

## Example

This example can be found in the `./examples` directory.

```typescript
import puppeteer from "puppeteer"

import { secure, Browser, ElementHandle, SecurePage } from "secure-puppeteer"
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

```

## Limitations

As mentioned above, this will not necessarily catch everything. For full isolation, my current recommendation is patching the base files as I develop this out over time.

Which is to say; make sure you test this fully before using it, and don't get overconfident:

![image](https://media1.tenor.com/images/e9f258352a7d64d3d779ba42c718a2c7/tenor.gif?itemid=14373538)



## Verifying Isolation

You can run a test against a basic execution monitor page set up here: https://prescience-data.github.io/execution-monitor.html (or use that as a base to design your own!).

If working correctly, there should be no visibility of whatever you execute via the `page.secure.<method>` tools.

![image](https://media1.tenor.com/images/311edf7d98e8d217bf70cc3ccd65be9f/tenor.gif?itemid=5348895)


## Community Support

Please only use the issue tracker for bugs, rather than questions. 

For any questions or support you can check out the community Discord channel here: https://scraping-chat.cf


