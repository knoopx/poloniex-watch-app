import React from 'react'
import moment from 'moment'
import { autobind } from 'core-decorators'
import { observable, computed } from 'mobx'
import { observer } from 'mobx-react'
import { Button } from 'react-desktop/macOs'

import FilterInput from './FilterInput'
import { Spacer, Gutter } from './Layout'
import { Pane, Body, Header } from './Pane'
import TabButton from './TabButton'
import { numberToCurrency } from '../services/Helper'

@observer
export default class OrderList extends React.PureComponent {
  @observable currentTab = 'open'
  @observable filter = ''

  static propTypes = {
  }

  static contextTypes = {
    accountStore: React.PropTypes.object.isRequired
  }

  @autobind
  renderOrder(order, index) {
    const [base, quote] = order.currencyPair.split('_', 2)

    return (
      <tr key={index}>
        <td>{order.type.toLocaleUpperCase()}</td>
        <td style={{ textAlign: 'right' }}>{numberToCurrency(order.amount, quote)}</td>
        <td style={{ textAlign: 'right' }}>{numberToCurrency(order.rate)}</td>
        <td style={{ textAlign: 'right' }}>{numberToCurrency(order.rate * order.amount, base)}</td>
        <td style={{ textAlign: 'right' }}>{moment(order.date).fromNow()}</td>
        {!order.tradeID && <td style={{ textAlign: 'right' }}><Button onClick={() => this.context.accountStore.cancelOrder(order.orderNumber)}>Cancel</Button></td>}
      </tr>
    )
  }

  @autobind
  filterOrder(order) {
    if (this.filter.length > 0) {
      return order.currencyPair.toLocaleLowerCase().indexOf(this.filter.toLocaleLowerCase()) >= 0
    }
    return true
  }

  @computed get matches() {
    const { accountStore } = this.context
    const orders = this.currentTab === 'open' ? accountStore.orders : accountStore.tradeHistory
    return orders.filter(this.filterOrder)
  }

  render() {
    const { accountStore } = this.context

    return (
      <Pane>
        <Header>
          <FilterInput placeholder="Orders" value={this.filter} onChange={value => this.filter = value} />
          <Spacer />
          <TabButton onClick={() => this.currentTab = 'open'} active={this.currentTab == 'open'} count={accountStore.orders.filter(this.filterOrder).length}>Open</TabButton>
          <Gutter size={8} />
          <TabButton onClick={() => this.currentTab = 'history'} active={this.currentTab == 'history'} count={accountStore.tradeHistory.filter(this.filterOrder).length}>History</TabButton>
        </Header>
        <Body>
          <table>
            <tbody>{this.matches.map(this.renderOrder)}</tbody>
          </table>
        </Body>
      </Pane>
    )
  }
}
