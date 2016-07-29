import React from 'react'
import PureRendererMixin from 'react-addons-pure-render-mixin'
import NavigationController from './NavigationController'

import './App.global.scss'

import RootLayout from './RootLayout'

export default React.createClass({
  propTypes: {
    settings: React.PropTypes.object.isRequired,
    watcher: React.PropTypes.object.isRequired,
    trader: React.PropTypes.object.isRequired
  },

  mixins: [PureRendererMixin],

  renderScene(route, navigation) {
    return <route.component {...route.props} rootNavigation={navigation} />
  },

  render() {
    const initialRoute = {component: RootLayout, props: this.props}

    return (
      <NavigationController initialRoute={initialRoute} renderScene={this.renderScene} />
    )
  }
})
