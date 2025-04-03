import { BasicType } from './types'
abstract class WebComponentBase {
  abstract render(): void;
  abstract reMount(): void;
}

export const createWebComponent = <P extends Record<string, BasicType>>(attrs: () => P) => {
  const initial = attrs()
  abstract class WebComponent extends HTMLElement {
    $props = attrs()
    constructor() {
      super()
      const map: PropertyDescriptorMap = {}
      for (const k in this.$props)
        map[k] = {
          get: () => this.$props[k],
          set: v => {
            (this.$props as Record<string, BasicType>)[k] = safeMapping(initial, k, v)
            if(['delay', 'useLazy'].includes(k)) {
              this.reMount()
              return
            }
            this.render()
          },
        }
      Object.defineProperties(this, map)
    }

    static get observedAttributes() {
      return Object.keys(initial).filter(k => isBasic(initial[k]))
    }

    attributeChangedCallback(k: string, _old: string, val: unknown) {
      const safeValue = safeMapping(initial, k, val)
      if (this.$props[k] !== safeValue) {
        (this.$props as Record<string, BasicType>)[k] = safeValue
      }
    }

    abstract render(): void
    abstract reMount(): void
  }
  return WebComponent as unknown as new () => WebComponentBase & P & HTMLElement
}

const safeMapping = (
  t: Record<string, BasicType>,
  k: string,
  v: unknown
): BasicType | undefined => {
  const prev = t[k]
  if (!isBasic(prev)) return undefined
  switch (typeof prev) {
    case 'number':
      return Number(v)
    case 'string':
      return String(v)
    case 'boolean':
      return v !== null && v !== 'false' && v !== false
    default:
      return undefined
  }
}

const isBasic = (v: BasicType): v is boolean | number | string => {
  const type = typeof v
  return type === 'number' || type === 'string' || type === 'boolean'
}
