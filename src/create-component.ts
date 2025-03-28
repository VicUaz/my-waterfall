abstract class WebComponentBase {
  abstract render(): void;
  abstract reMount(): void;
}

export const createWebComponent = <P extends Record<string, any>>(attrs: () => P) => {
  const initial = attrs()
  abstract class WebComponent extends HTMLElement {
    $props = attrs()
    constructor() {
      super()
      const map = {} as any
      for (const k in this.$props)
        map[k] = {
          get: () => this.$props[k],
          set: (v: any) => {
            // @ts-ignore
            this.$props[k] = safeMapping(initial, k, v)
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

    attributeChangedCallback(k: string, old: string, val: unknown) {
      val = safeMapping(initial, k, val)
      // @ts-ignore
      if (this.$props[k] !== val) {this.$props[k] = val}
    }

    abstract render(): void
    abstract reMount(): void
  }
  return WebComponent as unknown as new () => WebComponentBase & P & HTMLElement
}

const safeMapping = (t: Record<string, any>, k: string, v: any) => {
  const prev = t[k]
  if (!isBasic(prev)) return
  const type = typeof prev
  return {
    number: (v: string) => Number(v),
    string: (v: string) => String(v),
    boolean: (v: string) => v && v !== null && v !== 'false',
  }[type as string]!(v)
}

const isBasic = (v: any): v is boolean | number | string => {
  const type = typeof v
  return type === 'number' || type === 'string' || type === 'boolean'
}
