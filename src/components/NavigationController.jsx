import React from 'react'
import { observable, asFlat } from 'mobx'
import { observer } from 'mobx-react'

@observer
export default class NavigationController extends React.Component {
  static propTypes = {
    renderScene: React.PropTypes.func.isRequired
  }

  @observable routeStack = asFlat([this.props.initialRoute]);

  pop() {
    this.routeStack.pop()
  }

  push(route) {
    this.routeStack.push(route)
  }

  render() {
    const currentScene = this.routeStack[this.routeStack.length - 1]
    if (currentScene) {
      return this.props.renderScene(currentScene, this)
    }
    return null
  }
}
