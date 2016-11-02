import React from 'react'
import { render } from 'react-dom'

import 'font-awesome/css/font-awesome.css'

import App from './components/App'
import tickerStore from './stores/TickerStore'
import accountStore from './stores/AccountStore'

import './index.scss'

function renderApp() {
  render(<App tickerStore={tickerStore} accountStore={accountStore} />, document.getElementById('root'))
}

renderApp()
if (module.hot) {
  module.hot.accept(renderApp)
}
