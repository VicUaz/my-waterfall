import { PropsOption, RenderOptions } from './types'

export function triggerLayout<T extends HTMLElement>(container: T, { cols, gap }: PropsOption) {
  const domUtils:RenderOptions<T>  = {
    getW: el => el.offsetWidth,
    setW: (el, v) => (el.style.width = v + 'px'),
    getH: (el, itemWidth) => {
      const { offsetHeight } = el
      if (el instanceof HTMLImageElement) {
        if (!el.naturalHeight) return offsetHeight
        return Math.round((el.naturalHeight / el.naturalWidth) * itemWidth)
      }
      return offsetHeight
    },
    setH: (el, v) => (el.style.height = v + 'px'),
    getPad: (el) => {
      const pad = getComputedStyle(el)
      return [
        parseInt(pad.paddingTop),
        parseInt(pad.paddingRight),
        parseInt(pad.paddingBottom),
        parseInt(pad.paddingLeft),
      ]
    },
    setX: (el, v) => (el.style.left = v + 'px'),
    setY: (el, v) => (el.style.top = v + 'px'),
    getChildren: el => el.children as unknown as { [index: number]: T, readonly length: number },
  }
  const { getW, setW, getH, setH, getPad, setX, setY, getChildren } = domUtils
  // 读
  const [pt, pr, pb, pl] = getPad(container)
  const children = Array.from(getChildren(container))
  if (children.length) {
    const itemWidth = (getW(container) - gap * (cols - 1) - (pl + pr)) / cols
    const heightGroup = children.map(el => getH(el, itemWidth))
    const stack = Array(cols).fill(pt)
    // 写
    children.forEach((child, index) => {
      setW(child, itemWidth)
      const minItem = Math.min(...stack)
      const col = stack.indexOf(minItem)
      setY(child, stack[col])
      setX(child, pl + (itemWidth + gap) * col)
      stack[col] += heightGroup[index] + gap
    })
    // 设置容器高度
    setH(container, Math.max(...stack) - gap + pb)
  } else {
    setH(container, pt + pb)
  }
}
