import React from 'react'
import { observer } from 'mobx-react'

import RootLayout from './RootLayout'
import NavigationController from './NavigationController'

@observer
export default class App extends React.PureComponent {
  static propTypes = {
    tickerStore: React.PropTypes.object.isRequired,
    accountStore: React.PropTypes.object.isRequired
  }

  static childContextTypes = {
    tickerStore: React.PropTypes.object.isRequired,
    accountStore: React.PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      accountStore: this.props.accountStore,
      tickerStore: this.props.tickerStore
    }
  }

  renderScene(route, navigation) {
    const Component = route.component
    return <Component {...route.props} rootNavigation={navigation} />
  }

  render() {
    const initialRoute = { component: RootLayout, props: {} }

    return (
      <NavigationController initialRoute={initialRoute} renderScene={this.renderScene} />
    )
  }
}
