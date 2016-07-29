import React from 'react'
import {render} from 'react-dom'
import App from './components/App'
import tickerStore from './stores/TickerStore'
import accountStore from './stores/AccountStore'

function renderApp() {
  render(<App tickerStore={tickerStore} accountStore={accountStore} />, document.getElementById('root'))
}

renderApp()
if (module.hot) {
  module.hot.accept(renderApp)
}
