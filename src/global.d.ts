import { prevHeight, prevWidth } from './utils'

declare global {
  interface HTMLElement {
    [prevHeight]?: number,
    [prevWidth]?: number,
  }
  interface Element {
    [prevHeight]?: number,
    [prevWidth]?: number,
    offsetWidth: number
    offsetHeight: number
  }
}