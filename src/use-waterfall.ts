import { triggerLayout } from './trigger-layout'
import { debounce } from 'lodash-es'
import { PropsOption } from './types'
import { prevHeight, prevWidth } from './utils'

export function useWaterfall(el: HTMLElement, props: PropsOption) {
  let intersectionObserver: IntersectionObserver
  let sizeObserver: ResizeObserver // 监听大小变化
  let childObserver: MutationObserver // 监听元素增删
  let attrsObserver: MutationObserver // 监听属性变化
  
  function doRelayout() {
    requestAnimationFrame(() => {
      triggerLayout(el, props)
      el[prevWidth] = el.offsetWidth
      el[prevHeight] = el.offsetHeight
      attrsObserver.takeRecords()
    })
  }
  const debounceLayout = debounce(doRelayout, props.delay)

  function mount() {
    sizeObserver = new ResizeObserver((entries) => {
      const isChangeElSize = entries.some(({ target: el }) => {
        return el[prevWidth] !== el.offsetWidth || el[prevHeight] !== el.offsetHeight}
        )
      isChangeElSize && debounceLayout()
    })
    sizeObserver.observe(el)

    childObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((el) => {
          if(el instanceof HTMLImageElement) {
            el.onload = () => {
              const { naturalHeight, naturalWidth } = el
              el.style.aspectRatio = String(naturalWidth / naturalHeight)
              debounceLayout()
            }
            if (el.getAttribute('data-src')) {
              intersectionObserver.observe(el)
            }
          }
        })
      })
      doRelayout()
    })

    intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const target = entry.target as HTMLImageElement
          target.src = target.dataset.src;
          intersectionObserver.unobserve(entry.target);
        }
      })
      doRelayout()
    })

    attrsObserver = new MutationObserver(debounceLayout)
    childObserver.observe(el, { childList: true, attributes: false })
    attrsObserver.observe(el, { childList: false, attributes: true })
    doRelayout()
  }

  function unmount() {
    intersectionObserver?.disconnect()
    sizeObserver?.disconnect()
    childObserver.disconnect()
    attrsObserver.disconnect()
  }

  return { debounceLayout, mount, unmount }
}
