import React from 'react'
import { Button } from 'react-desktop/macOs'
import { observable, computed } from 'mobx'
import { observer } from 'mobx-react'
import { autobind } from 'core-decorators'
import { Pane, Header } from './Pane'
import { Row, Column, Gutter, Spacer } from './Layout'
import { numberToCurrency, numberToPercentage } from '../services/Helper'

@observer
export default class BuyPane extends React.PureComponent {
  static propTypes = {
    ticker: React.PropTypes.object.isRequired
  }

  static contextTypes = {
    accountStore: React.PropTypes.object.isRequired
  }

  @computed get availableAmount() { return this.context.accountStore.getAvailableBalance(this.props.ticker.base) }
  @observable rate = this.props.ticker.highestBid
  @observable amount = 0.0
  @observable amountModifier = 0.0
  @computed get total() { return this.rate * this.amount }

  @autobind
  onChangeRate(e) {
    const { valueAsNumber } = e.target
    this.rate = this.getModifierRate(valueAsNumber / 100)
  }

  getModifierRate(value) {
    const { ticker } = this.props
    if (value === 0) { return ticker.highestBid }
    return (ticker.highestBid + (ticker.highestBid * value))
  }

  @autobind
  onChangeAmount(e) {
    const { valueAsNumber } = e.target
    this.amountModifier = valueAsNumber
    this.amount = this.getModifierAmount(valueAsNumber / 100)
  }

  getModifierAmount(value) {
    return (this.availableAmount * value / 100)
  }

  render() {
    const { ticker } = this.props

    return (
      <Pane>
        <Header>
          Buy
          <Spacer />
          {numberToCurrency(ticker.quoteVolume, ticker.quote)}
        </Header>
        <Column style={{ padding: 16 }}>
          <Row style={{ marginBottom: 24 }}>
            <Column style={{ width: 60, textAlign: 'right' }}>Rate</Column>
            <Gutter />
            <Column flex={1}>
              <Row style={{ alignItems: 'center', marginBottom: 8 }}>
                <input value={this.rate.toFixed(8)} onChange={this.onChangeRate} />
                <Gutter />
                {ticker.quote}
              </Row>
              <Row style={{ fontSize: 12, marginBottom: 8, alignItems: 'center' }}>
                <i className="fa fa-arrow-circle-up" onClick={() => { this.rate = ticker.highestBid }} />
                <Gutter size={4} />
                {numberToCurrency(ticker.highestBid, ticker.quote)}
                <Gutter size={4} />
                Lowest Ask
              </Row>
            </Column>
          </Row>

          <Row style={{ marginBottom: 24 }}>
            <Column style={{ width: 60, textAlign: 'right' }}>Amount</Column>
            <Gutter />
            <Column flex={1}>
              <Row style={{ alignItems: 'center', marginBottom: 4 }}>
                <input value={this.amount.toFixed(8)} onChange={this.onChangeAmount} />
                <Gutter />
                {ticker.base}
              </Row>
              <Row style={{ fontSize: 12, marginBottom: 8, alignItems: 'center' }}>
                {numberToCurrency(this.availableAmount, ticker.base)}
                <Gutter size={4} />
                Available
              </Row>
              <Row style={{ alignItems: 'center' }}>
                <input type="range" value={this.amountModifier} min={0} max={100} step={5} onChange={this.onChangeAmount} />
                <Gutter />
                {this.amountModifier.toFixed(0)}%
              </Row>
            </Column>
          </Row>
          <Button type="submit" disabled={this.total === 0} style={{ marginLeft: 76 }}>BUY {numberToCurrency(this.total, ticker.base)}</Button>
        </Column>
      </Pane>
    )
  }
}
