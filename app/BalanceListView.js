import React from 'react'
import PureRendererMixin from 'react-addons-pure-render-mixin'
import math from 'mathjs'

import {Pane, Body, Header} from './Pane'

export default React.createClass({
  propTypes: {
    trader: React.PropTypes.any.isRequired,
    watcher: React.PropTypes.any.isRequired,
  },

  mixins: [PureRendererMixin],

  getInitialState() {
    return {
      balances: this.props.trader.balances,
    }
  },

  componentWillMount() {
    this.props.trader.on('balances', this.onBalances)
  },

  componentWillUnmount() {
    this.props.trader.off('balances', this.onBalances)
  },

  onBalances(balances) {
    this.setState({balances})
  },

  renderBalance(balance, currency) {
    return (
      <tr key={currency}>
        <td>{currency}</td>
        <td style={{textAlign: 'right'}}>{balance.toFixed(8)}</td>
      </tr>
    )
  },

  render() {
    const balances = this.state.balances.filter((balance) => balance > 0.0)

    return (
      <Pane>
        <Header>Balances</Header>
        <Body>
          <table>
            <tbody>
              {balances.map(this.renderBalance).toArray()}
            </tbody>
          </table>
        </Body>
      </Pane>
    )
  }
})
