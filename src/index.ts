import { useWaterfall } from './use-waterfall'
import { createWebComponent } from './create-component'

const defaultProps = () => ({
  cols: 2,
  gap: 4,
  delay: 300,
  useLazy: false
})

class WaterfallElement extends createWebComponent(defaultProps) {
  $layout: ReturnType<typeof useWaterfall>
  connectedCallback () {
    this.$layout = useWaterfall(this, this)
    this.$layout.mount()
  }
  disconnectedCallback () {
    this.$layout.unmount()
  }
  render () {
    this.isConnected && this.$layout.debounceLayout()
  }
  reMount (){
    if(this.isConnected) {
      this.$layout.unmount()
      this.$layout = useWaterfall(this, this)
      this.$layout.mount()
    }
  }
}

customElements.define('my-waterfall', WaterfallElement)