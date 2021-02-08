import { ElementHandle } from "puppeteer/lib/esm/puppeteer/common/JSHandle"

import {
  CDPMethod,
  CreateIsolatedWorldResponse,
  DOMWorld,
  EvaluateFn,
  EvaluateFnReturnType,
  ExposedFrame,
  ExposedModules,
  ExposedPage,
  FrameAddScriptTagOptions,
  FrameAddStyleTagOptions,
  IsolationManager,
  MouseButtons,
  Page,
  SerializableOrJSHandle,
  UnwrapPromiseLike,
  WrapElementHandle
} from "./types"

/**
 * @class {IsolatedWorld}
 * @classdesc Provides tools to isolate puppeteer execution.
 * @see https://github.com/puppeteer/puppeteer/blob/main/src/common/Page.ts
 * @implements {IsolationManager}
 */
export class IsolatedWorld implements IsolationManager {
  /**
   * Internal container for active page.
   * @type {ExposedPage}
   * @protected
   */
  protected _page: ExposedPage

  /**
   * Constructor
   * Accepts an active page, should deconstruct if page becomes void.
   *
   * @param {Page} page
   */
  public constructor(page: Page) {
    this._page = page as ExposedPage
  }

  /**
   * Accessor for current page with types exposed.
   *
   * @return {ExposedPage}
   */
  public get page(): ExposedPage {
    return this._page
  }

  /**
   * Accessor for main frame with types exposed.
   *
   * @return {ExposedFrame}
   */
  public get frame(): ExposedFrame {
    return this._page.mainFrame() as ExposedFrame
  }

  /**
   * Accessor for the pre-made secondary isolated world.
   *
   * @return {IsolatedWorld}
   */
  public get world(): DOMWorld {
    return this.frame._secondaryWorld
  }

  /**
   * Access to isolated `evaluate` method.
   *
   * @param {T} pageFunction
   * @param {SerializableOrJSHandle} args
   * @return {Promise<UnwrapPromiseLike<EvaluateFnReturnType<T>>>}
   */
  public async evaluate<T extends EvaluateFn>(
    pageFunction: T,
    ...args: SerializableOrJSHandle[]
  ): Promise<UnwrapPromiseLike<EvaluateFnReturnType<T>>> {
    const { world } = this.modules()
    return world.evaluate<T>(pageFunction, ...args)
  }

  /**
   * Access to isolated `$` method.
   *
   * @param {string} selector
   * @return {Promise<ElementHandle | null>}
   */
  public async $(selector: string): Promise<ElementHandle | null> {
    return this.world.$(selector)
  }

  /**
   * Access to isolated `$x` method.
   *
   * @param {string} expression
   * @return {Promise<ElementHandle[]>}
   */
  public async $x(expression: string): Promise<ElementHandle[]> {
    return this.world.$x(expression)
  }

  /**
   * Access to isolated `$eval` method.
   *
   * @param {string} selector
   * @param {(element: Element, ...args: unknown[]) => (Promise<ReturnType> | ReturnType)} pageFunction
   * @param {SerializableOrJSHandle} args
   * @return {Promise<WrapElementHandle<ReturnType>>}
   */
  public async $eval<ReturnType>(
    selector: string,
    pageFunction: (
      element: Element,
      ...args: unknown[]
    ) => ReturnType | Promise<ReturnType>,
    ...args: SerializableOrJSHandle[]
  ): Promise<WrapElementHandle<ReturnType>> {
    return this.world.$eval<ReturnType>(selector, pageFunction, ...args)
  }

  /**
   * Access to isolated `$$eval` method.
   *
   * @param {string} selector
   * @param {(elements: Element[], ...args: unknown[]) => (Promise<ReturnType> | ReturnType)} pageFunction
   * @param {SerializableOrJSHandle} args
   * @return {Promise<WrapElementHandle<ReturnType>>}
   */
  public async $$eval<ReturnType>(
    selector: string,
    pageFunction: (
      elements: Element[],
      ...args: unknown[]
    ) => ReturnType | Promise<ReturnType>,
    ...args: SerializableOrJSHandle[]
  ): Promise<WrapElementHandle<ReturnType>> {
    return this.world.$$eval<ReturnType>(selector, pageFunction, ...args)
  }

  /**
   * Access to isolated `$$` method.
   *
   * @param {string} selector
   * @return {Promise<ElementHandle[]>}
   */
  public async $$(selector: string): Promise<ElementHandle[]> {
    return this.world.$$(selector)
  }

  /**
   * Access to isolated `addScriptTag` method.
   *
   * @param {FrameAddScriptTagOptions} options
   * @return {Promise<ElementHandle>}
   */
  public async addScriptTag(
    options: FrameAddScriptTagOptions
  ): Promise<ElementHandle> {
    return this.world.addScriptTag(options)
  }

  /**
   * Access to isolated `addStyleTag` method.
   *
   * @param {FrameAddStyleTagOptions} options
   * @return {Promise<ElementHandle>}
   */
  public async addStyleTag(
    options: FrameAddStyleTagOptions
  ): Promise<ElementHandle> {
    return this.world.addStyleTag(options)
  }

  /**
   * Access to isolated `click` method.
   *
   * @param {string} selector
   * @param {{delay?: number, button?: MouseButtons, clickCount?: number}} options
   * @return {Promise<void>}
   */
  public async click(
    selector: string,
    options: {
      delay?: number
      button?: MouseButtons
      clickCount?: number
    } = {}
  ): Promise<void> {
    return this.world.click(selector, options)
  }

  /**
   * Access to isolated `type` method.
   *
   * @param {string} selector
   * @param {string} text
   * @param {{delay: number}} options
   * @return {Promise<void>}
   */
  public async type(
    selector: string,
    text: string,
    options?: { delay: number }
  ): Promise<void> {
    return this.world.type(selector, text, options)
  }

  /**
   * Create and return a new isolated execution context.
   * Generally not recommended unless you know why would want to do this manually.
   *
   * @return {Promise<CreateIsolatedWorldResponse>}
   */
  public async create(): Promise<CreateIsolatedWorldResponse> {
    const { page, frame } = this.modules()
    const method: CDPMethod = "Page.createIsolatedWorld"
    return await page._client.send<"Page.createIsolatedWorld">(method, {
      frameId: frame._id,
      grantUniveralAccess: true, // This spelling mistake is upstream.
      worldName: `iso${process.hrtime.bigint()}`
    })
  }

  /**
   * Exports key isolation modules.
   * Note, due to the way these are generated they may not survive navigation.
   *
   * @return {ExposedModules}
   */
  public modules(): ExposedModules {
    const page: ExposedPage = this._page
    const frame: ExposedFrame = page.mainFrame() as ExposedFrame
    const world: DOMWorld = frame._secondaryWorld
    return { page, frame, world }
  }
}
