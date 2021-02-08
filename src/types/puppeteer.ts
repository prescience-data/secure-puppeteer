import { Frame, FrameBase, Page } from "puppeteer"
import { DOMWorld as DOMWorldBase } from "puppeteer/lib/esm/puppeteer/common/DOMWorld"
import { FrameManager } from "puppeteer/lib/esm/puppeteer/common/FrameManager"
import { ElementHandle as ElementHandleBase } from "puppeteer/lib/esm/puppeteer/common/JSHandle"

import {
  CreateIsolatedWorldRequest,
  CreateIsolatedWorldResponse,
  EvaluateRequest,
  EvaluateResponse
} from "./protocol"

export {
  Browser,
  EvaluateFn,
  EvaluateFnReturnType,
  MouseButtons,
  Page,
  SerializableOrJSHandle,
  WrapElementHandle
} from "puppeteer"
export { UnwrapPromiseLike } from "puppeteer/lib/esm/puppeteer/common/EvalTypes"
export {
  FrameAddScriptTagOptions,
  FrameAddStyleTagOptions
} from "puppeteer/lib/esm/puppeteer/common/FrameManager"

export type ElementHandle = ElementHandleBase
export type DOMWorld = DOMWorldBase & FrameBase
export type CDPMethod = "Page.createIsolatedWorld" | "Runtime.evaluate"

export interface CDPRequestLookup extends Record<CDPMethod | string, unknown> {
  "Page.createIsolatedWorld": CreateIsolatedWorldRequest
  "Runtime.evaluate": EvaluateRequest
}

export interface CDPResponseLookup extends Record<CDPMethod | string, unknown> {
  "Page.createIsolatedWorld": CreateIsolatedWorldResponse
  "Runtime.evaluate": EvaluateResponse
}

export type CDPRequest<M extends CDPMethod | string> = M extends CDPMethod
  ? CDPRequestLookup[M]
  : Record<string, unknown>

export type CDPResponse<M extends CDPMethod | string> = M extends CDPMethod
  ? CDPResponseLookup[M]
  : Record<string, unknown>

export interface CDPClient {
  send<M extends CDPMethod | string = CDPMethod>(
    method: M,
    params: CDPRequest<M>
  ): Promise<CDPResponse<M>>
}

export interface ExposedFrame extends Frame {
  _id: string
  _mainWorld: DOMWorld
  _secondaryWorld: DOMWorld
  _frameManager: FrameManager
}

export interface ExposedPage extends Page {
  _client: CDPClient
}
