import React from 'react'
import firstBy from 'thenby'
import math from 'mathjs'
import {autobind} from 'core-decorators'
import {observer} from 'mobx-react'
import {observable, computed} from 'mobx'

import Blink from './Blink'
import TrendIndicator from './TrendIndicator'
import FilterInput from './FilterInput'
import {Pane, Body, Header} from './Pane'
import {Row, Column, Gutter, Spacer} from './Layout'
import {List, ListItem} from './List'

import {numberColor, changePercent, numberToPercentage, numberToCurrency} from '../Services/Helper'

@observer
export default class BalanceList extends React.PureComponent {
  static propTypes = {
  }

  static contextTypes = {
    accountStore: React.PropTypes.object.isRequired,
    tickerStore: React.PropTypes.object.isRequired,
  }

  @autobind
  renderBalance(balance) {
    const {accountStore, tickerStore} = this.context
    const currencyPair = `BTC_${balance.quote}`
    const totalBalance = balance.available + balance.onOrders
    const lastPurchaseRate = accountStore.getLastPurchaseRate(currencyPair)
    const historyProfit = accountStore.getProfit(currencyPair)
    const lastPurchaseProfit = lastPurchaseRate - tickerStore.getLast(currencyPair)
    const lastPurchaseProfitPercent = changePercent(lastPurchaseRate, tickerStore.getLast(currencyPair))
    return (
      <ListItem key={balance.quote}>
        <Column flex={1}>
          <Row>
            <Column>
              <Row style={{display: "block"}}>
                <span style={{fontWeight: 'bold'}}>{balance.quote}</span> <i className="fa fa-arrow-circle-right" onClick={() => tickerStore.filter.query = balance.quote } />
              </Row>
            </Column>
            <Spacer />
            <Blink style={{fontSize: 12}}>{numberToCurrency(totalBalance)}</Blink>
          </Row>
          <Row style={{fontSize: 12}}>
            <Column>Available</Column>
            <Spacer />
            <Blink>{numberToCurrency(balance.available)}</Blink>
          </Row>
          <Gutter />
          <Row style={{fontSize: 12}}>
            <Column>On Orders</Column>
            <Spacer />
            <Blink>{numberToCurrency(balance.onOrders)}</Blink>
          </Row>
        </Column>
        <Gutter />
        <Column flex={2} >
          <Column>
            <Row style={{fontSize: 12}}>
              Estimated Value
              <Spacer />
              <TrendIndicator value={balance.btcValue} />
              <Blink>{numberToCurrency(balance.btcValue, 'BTC')}</Blink>
            </Row>
            <Row style={{fontSize: 12}}>
              Profit/Loss
              <Spacer />
              <Blink style={{color: numberColor(historyProfit)}}>{numberToCurrency(Math.abs(historyProfit), 'BTC')}</Blink>
            </Row>
            <Row style={{fontSize: 12}}>
              Last Purchase
              <Spacer />
              {totalBalance > 0 && <Blink style={{color: numberColor(lastPurchaseProfitPercent)}}>{numberToPercentage(lastPurchaseProfitPercent)}</Blink>}
              {totalBalance > 0 && <TrendIndicator value={lastPurchaseProfit} />}
              <Blink>{numberToCurrency(lastPurchaseRate, 'BTC')}</Blink>
            </Row>
          </Column>
        </Column>
      </ListItem>
    )
  }

  @observable filter = ''

  @autobind
  filterBalance(balance) {
    if (this.filter.length > 0) {
      return balance.quote.toLocaleLowerCase().indexOf(this.filter.toLocaleLowerCase()) >= 0
    }
    return true
  }

  @computed get matches() {
    const {balances} = this.context.accountStore
    return balances.filter(this.filterBalance).sort(firstBy('btcValue', -1))
  }

  render() {
    const {balances} = this.context.accountStore
    const btcValue = math.sum(balances.map(b => b.btcValue))

    return (
      <Pane>
        <Header>
          <FilterInput placeholder="Balances" value={this.filter} onChange={value => this.filter = value} />
          <Spacer />
          <span style={{fontStyle: 'italic', fontSize: 12, color: '#aaa'}}>
            <span>{numberToCurrency(btcValue, 'BTC')}</span>
            <TrendIndicator value={btcValue} />
          </span>
        </Header>
        <Body>
          <List>{this.matches.map(this.renderBalance)}</List>
        </Body>
      </Pane>
    )
  }
}
