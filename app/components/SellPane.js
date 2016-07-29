import React from 'react'
import {Button} from 'react-desktop/macOs'
import {observable, computed} from 'mobx'
import {observer} from 'mobx-react'
import {autobind} from 'core-decorators'
import CurrencyInput from './CurrencyInput'

import {Pane, Header} from './Pane'
import {Row, Column, Gutter, Spacer} from './Layout'
import {numberToCurrency, numberToPercentage, changePercent, numberColor} from '../Services/Helper'

@observer
export default class BuyPane extends React.PureComponent {
  static propTypes = {
    ticker: React.PropTypes.object.isRequired,
  }

  static contextTypes = {
    accountStore: React.PropTypes.object.isRequired
  }

  @computed get availableAmount() { return this.context.accountStore.getAvailableBalance(this.props.ticker.quote) }
  @observable rate = this.props.ticker.lowestAsk
  @observable amount = 0.0
  @observable amountModifier = 0.0
  @computed get total() { return this.rate * this.amount }
  @computed get lastPurchase() { return this.context.accountStore.getLastPurchaseRate(this.props.ticker.currencyPair) }

  @autobind
  onChangeAmount(e) {
    const {valueAsNumber} = e.target
    this.amountModifier = valueAsNumber
    this.amount = this.getModifierAmount(valueAsNumber / 100)
  }

  @autobind
  getModifierAmount(value) {
    return (this.availableAmount * value / 100)
  }

  @autobind
  changeAmount(value) {
    this.amount = value
    this.amountModifier = 0.0
  }

  render() {
    const {ticker} = this.props

    return (
      <Pane>
        <Header>
          Sell
          <Spacer />
          {numberToCurrency(ticker.baseVolume, ticker.base)}
        </Header>
        <Column style={{padding: 16}}>
          <Row style={{marginBottom: 32}}>
            <Column style={{width: 60, textAlign: 'right'}}>Rate</Column>
            <Gutter />
            <Column>
              <Row style={{marginBottom: 8, alignItems: 'center'}}>
                <CurrencyInput format='0,0.00000000' symbol={ticker.base} min={0} value={this.rate} onChange={(value) => { this.rate = value }} />
                <Gutter/>
                {numberToPercentage(changePercent(this.lastPurchase, this.rate))}
              </Row>
              <Row style={{fontSize: 12, marginBottom: 8, alignItems: 'center'}}>
                <i className="fa fa-arrow-circle-up" onClick={() => { this.rate = ticker.lowestAsk }} />
                <Gutter size={4} />
                {numberToCurrency(ticker.lowestAsk, ticker.base)}
                <Gutter size={4} />
                Highest Bid
              </Row>
              <Row style={{fontSize: 12, marginBottom: 8, alignItems: 'center'}}>
                <i className="fa fa-arrow-circle-up" onClick={() => { this.rate = this.lastPurchase }} />
                <Gutter size={4} />
                {numberToCurrency(this.lastPurchase, ticker.base)}
                <Gutter size={4} />
                Last Purchase
              </Row>
            </Column>
          </Row>
          <Row style={{marginBottom: 32}}>
            <Column style={{width: 60, textAlign: 'right'}}>Amount</Column>
            <Gutter />
            <Column flex={1}>
              <Row style={{alignItems: 'center', marginBottom: 4}}>
                <CurrencyInput format='0,0.00000000' symbol={ticker.base} min={0} max={this.availableAmount} value={this.amount} onChange={this.onChangeAmount} />
              </Row>
              <Row style={{fontSize: 12, marginBottom: 8}}>
                {numberToCurrency(this.availableAmount, ticker.quote)}
                <Gutter size={4} />
                Available
              </Row>
              <Row style={{alignItems: 'center'}}>
                <input type="range" value={this.amountModifier} min={0} max={100} step={5} onChange={this.onChangeAmount} />
                <Gutter />
                {this.amountModifier}%
              </Row>
            </Column>
          </Row>
          <Button type="submit" disabled={this.total === 0} style={{marginLeft: 76}}>SELL {numberToCurrency(this.total, ticker.base)}</Button>
        </Column>
      </Pane>
    )
  }
}
