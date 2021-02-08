import { IsolatedWorld } from "./isolate"
import { IsolationLoader, IsolationManager, Page, SecurePage } from "./types"

/**
 * Isolates a specific page and returns the isolation manager.
 *
 * @param {Page} page
 * @return {IsolationManager}
 */
export const isolate: IsolationLoader = (page: Page): IsolationManager =>
  new IsolatedWorld(page)

/**
 * Injects an isolation into the page and returns a typed page.
 *
 * @param {Page} page
 * @return {SecurePage}
 */
export const secure = (page: Page): SecurePage =>
  Object.assign(page, { secure: isolate(page) })
