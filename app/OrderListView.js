import React from 'react'
import PureRendererMixin from 'react-addons-pure-render-mixin'
import {Pane, Body, Header} from './Pane'

export default React.createClass({
  propTypes: {
    trader: React.PropTypes.object.isRequired,
    watcher: React.PropTypes.object.isRequired,
  },

  mixins: [PureRendererMixin],

  getInitialState() {
    return {
      orders: this.props.trader.orders,
    }
  },

  componentWillMount() {
    this.props.trader.on('orders', this.onOrders)
  },

  componentWillUnmount() {
    this.props.trader.off('orders', this.onOrders)
  },

  onOrders(orders) {
    this.setState({orders})
  },

  renderOrder(order) {
    const [market, currency] = order.currencyPair.split('_', 2)
    return (
      <tr key={order.number}>
        <td>{order.type.toLocaleUpperCase()}</td>
        <td>{order.amount.toFixed(8)} {currency}</td>
        <td>{order.rate.toFixed(8)} {currency}/{market}</td>
        <td>{(order.rate * order.amount).toFixed(8)} {market}</td>
      </tr>
    )
  },

  render() {
    const orders = this.state.orders.map((currencyPairOrders, currencyPair) => {
      return currencyPairOrders.map((order) => {
        return {...order, currencyPair}
      })
    }).toList().flatten()

    return (
      <Pane>
        <Header>Orders ({orders.size})</Header>
        <Body>
          <table>
            <tbody>{orders.map(this.renderOrder).toArray()}</tbody>
          </table>
        </Body>
      </Pane>
    )
  }
})
