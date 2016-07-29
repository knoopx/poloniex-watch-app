import React from 'react'

import Immutable from 'immutable'

export default class NavigationController extends React.PureComponent {
  static propTypes = {
    renderScene: React.PropTypes.func.isRequired
  }

  state = {
    routeStack: Immutable.List([this.props.initialRoute])
  }

  pop() {
    this.setState({
      routeStack: this.state.routeStack.pop()
    })
  }

  push(route) {
    this.setState({
      routeStack: this.state.routeStack.push(route)
    })
  }

  render() {
    return (
      this.props.renderScene(this.state.routeStack.last(), this)
    )
  }
}
