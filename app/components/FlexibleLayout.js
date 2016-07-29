import React from 'react'
import {autobind, debounce, decorate} from 'core-decorators'
import {findDOMNode} from 'react-dom'

export default class FlexibleLayout extends React.Component {
  static propTypes = {
    render: React.PropTypes.func.isRequired
  }

  state = {
    isUpdating: true
  }

  componentDidMount() {
    this.updateLayout()
    window.addEventListener('resize', this.scheduleUpdate)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.scheduleUpdate)
  }

  @autobind
  @debounce(100)
  scheduleUpdate() {
    this.setState({isUpdating: true}, this.updateLayout)
  }

  @autobind
  updateLayout() {
    requestAnimationFrame(() => {
      this.setState({
        isUpdating: false,
        layout: findDOMNode(this).parentNode.getBoundingClientRect()
      })
    })
  }

  render() {
    if (this.state.isUpdating) { return <noscript /> }
    return this.props.render(this.state.layout)
  }
}
