import React from 'react'
import PureRendererMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'

export default React.createClass({
  propTypes: {
    renderScene: React.PropTypes.func.isRequired
  },

  mixins: [PureRendererMixin],

  getInitialState() {
    return {
      routeStack: Immutable.List([this.props.initialRoute])
    }
  },

  pop() {
    this.setState({
      routeStack: this.state.routeStack.pop()
    })
  },

  push(route) {
    this.setState({
      routeStack: this.state.routeStack.push(route)
    })
  },

  render() {
    return (
      this.props.renderScene(this.state.routeStack.last(), this)
    )
  }
})
