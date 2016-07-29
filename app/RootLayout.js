import React from 'react'
import PureRendererMixin from 'react-addons-pure-render-mixin'

import NavigationController from './NavigationController'
import {Footer} from './Pane'
import SettingsView from './SettingsView'
import OrderListView from './OrderListView'
import BalanceListView from './BalanceListView'
import CurrencyPairListView from './CurrencyPairListView'

import {Row, Column, Divider, Spacer} from './Layout'

export default React.createClass({
  propTypes: {
    rootNavigation: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
    watcher: React.PropTypes.object.isRequired,
    trader: React.PropTypes.object.isRequired
  },

  mixins: [PureRendererMixin],

  onClickSettings() {
    this.props.rootNavigation.push({component: SettingsView, props: this.props})
  },

  renderScene(route, navigation) {
    return <route.component {...route.props} navigation={navigation} />
  },

  render() {
    const {watcher, trader} = this.props
    const initialRoute = {component: CurrencyPairListView, props: this.props}
    return (
      <Column flex={1}>
        <Row flex={1}>
          <Column flex={1}>
            <Row flex={1}>
              <NavigationController renderScene={this.renderScene} initialRoute={initialRoute} />
              <Divider direction="vertical" />
              <Column flex={1}>
                <OrderListView trader={trader} watcher={watcher} />
                <Divider direction="horizontal" />
                <BalanceListView watcher={watcher} trader={trader} />
              </Column>
            </Row>
          </Column>
        </Row>
        <Footer>
          <Spacer />
          <i className="fa fa-cog" onClick={this.onClickSettings} />
        </Footer>
      </Column>
    )
  }
})
