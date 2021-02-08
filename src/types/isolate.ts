import { ElementHandle } from "puppeteer/lib/esm/puppeteer/common/JSHandle"

import { CreateIsolatedWorldResponse } from "./protocol"
import {
  DOMWorld,
  EvaluateFn,
  EvaluateFnReturnType,
  ExposedFrame,
  ExposedPage,
  FrameAddScriptTagOptions,
  FrameAddStyleTagOptions,
  Page,
  SerializableOrJSHandle,
  UnwrapPromiseLike,
  WrapElementHandle
} from "./puppeteer"

export type IsolationLoader = (page: Page) => IsolationManager

export interface SecurePage extends Page {
  secure: IsolationManager
}

export interface IsolationManager {
  readonly page: ExposedPage
  readonly frame: ExposedFrame
  readonly world: DOMWorld

  create(): Promise<CreateIsolatedWorldResponse>

  evaluate<T extends EvaluateFn>(
    pageFunction: T,
    ...args: SerializableOrJSHandle[]
  ): Promise<UnwrapPromiseLike<EvaluateFnReturnType<T>>>

  $(selector: string): Promise<ElementHandle | null>

  $x(expression: string): Promise<ElementHandle[]>

  $eval<ReturnType>(
    selector: string,
    pageFunction: (
      element: Element,
      ...args: unknown[]
    ) => ReturnType | Promise<ReturnType>,
    ...args: SerializableOrJSHandle[]
  ): Promise<WrapElementHandle<ReturnType>>

  $$eval<ReturnType>(
    selector: string,
    pageFunction: (
      elements: Element[],
      ...args: unknown[]
    ) => ReturnType | Promise<ReturnType>,
    ...args: SerializableOrJSHandle[]
  ): Promise<WrapElementHandle<ReturnType>>

  $$(selector: string): Promise<ElementHandle[]>

  addScriptTag(options: FrameAddScriptTagOptions): Promise<ElementHandle>

  addStyleTag(options: FrameAddStyleTagOptions): Promise<ElementHandle>

  click(
    selector: string,
    options?: {
      delay?: number
      button?: "left" | "middle" | "right" | undefined
      clickCount?: number
    }
  ): Promise<void>

  type(
    selector: string,
    text: string,
    options?: { delay: number }
  ): Promise<void>
}

export interface ExposedModules {
  page: ExposedPage
  frame: ExposedFrame
  world: DOMWorld
}
