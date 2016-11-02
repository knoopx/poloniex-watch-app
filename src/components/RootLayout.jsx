import React from 'react'
import { autobind } from 'core-decorators'
import DevTools from 'mobx-react-devtools'

import NavigationController from './NavigationController'
import { Footer } from './Pane'
import Settings from './Settings'
import OrderListView from './OrderListView'
import BalanceList from './BalanceList'
import TickerList from './TickerList'

import { Row, Column, Divider, Spacer } from './Layout'

export default class RootLayout extends React.PureComponent {
  static propTypes = {
    rootNavigation: React.PropTypes.object.isRequired
  }

  @autobind
  onClickSettings() {
    this.props.rootNavigation.push({ component: Settings, props: this.props })
  }

  @autobind
  renderScene(route, navigation) {
    const Component = route.component
    return <Component {...route.props} navigation={navigation} />
  }

  render() {
    const initialRoute = { component: TickerList, props: this.props }

    return (
      <Column flex={1}>
        <Row flex={1}>
          <Column flex={1}>
            <Row flex={1}>
              <NavigationController renderScene={this.renderScene} initialRoute={initialRoute} />
              <Divider direction="vertical" />
              <Column flex={1}>
                <OrderListView />
                <Divider direction="horizontal" />
                <BalanceList />
              </Column>
            </Row>
          </Column>
        </Row>
        <Footer>
          <Spacer />
          <i className="fa fa-cog" onClick={this.onClickSettings} />
        </Footer>
        {process.env.NODE_ENV === 'development' && <DevTools position={{ bottom: 0, left: 20 }} />}
      </Column>
    )
  }
}
