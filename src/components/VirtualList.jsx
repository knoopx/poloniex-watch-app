import React from 'react'
import { propTypes, observer } from 'mobx-react'
import { autobind } from 'core-decorators'
import { observable, action, transaction } from 'mobx'

@autobind
@observer
export default class VirtualList extends React.Component {
  static propTypes = {
    items: propTypes.arrayOrObservableArray.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
    renderItem: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  @observable scrollTop
  @observable clientHeight


  @action onResize() {
    this.update(this.container)
  }

  @action onScroll(e) {
    this.update(e.target)
  }

  @action update(container) {
    this.scrollTop = container.scrollTop
    this.clientHeight = container.clientHeight
  }

  @action setContainer(container) {
    if (container) {
      setTimeout(() => {
        this.update(container)
        this.container = container
      }, 0)
    }
  }

  scrollToTop() {
    if (this.container) {
      this.container.scrollTop = 0
    }
  }

  renderInner() {
    const { scrollTop, clientHeight } = this
    const height = this.props.itemHeight * this.props.items.length
    const top = Math.max(0, scrollTop)
    const bottom = Math.max(0, Math.min(height, scrollTop + clientHeight))
    const firstItemIndex = Math.max(0, Math.floor(top / this.props.itemHeight))
    const lastItemIndex = Math.ceil(bottom / this.props.itemHeight) - 1
    const offset = firstItemIndex * this.props.itemHeight
    return (
      <div style={{ height: height - offset, transform: `translateZ(-1px) translateY(${offset}px)` }}>
        {this.props.items.slice(firstItemIndex, lastItemIndex + 1).map(this.props.renderItem)}
      </div>
    )
  }

  render() {
    return (
      <div style={{ display: 'flex', flex: '1 1 100%', flexDirection: 'row', overflow: 'auto' }} onScroll={this.onScroll}>
        <div ref={this.setContainer} style={{ flex: 1, flexDirection: 'column' }}>
          {this.container && this.renderInner()}
        </div>
      </div>
    )
  }
}
