import { useWaterfall } from './use-waterfall'
import { createWebComponent } from './create-component'

const defaultProps = () => ({
  cols: 2,
  gap: 4,
  delay: 300,
  useLazy: true
})

export class WaterfallElement extends createWebComponent(defaultProps) {
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
