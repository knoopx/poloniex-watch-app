import React from 'react'
import math from 'mathjs'
import { autobind } from 'core-decorators'
import { observer } from 'mobx-react'
import { findDOMNode } from 'react-dom'

import { ReferenceLine } from './Chart'
import TickerSparkline from './TickerSparkline'
import LoadingView from './LoadingView'

import Blink from './Blink'
import Star from './Star'
import TrendIndicator from './TrendIndicator'
import { Row, Column, Gutter, Spacer } from './Layout'

import { numberColor, changePercent, numberToPercentage, numberToCurrency } from '../services/Helper'

@observer
export default class TickerListItem extends React.PureComponent {
  static propTypes = {
    ticker: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired
  }

  static contextTypes = {
    tickerStore: React.PropTypes.object.isRequired,
    accountStore: React.PropTypes.object.isRequired
  }

  @autobind
  onClick(e) {
    if (e.target !== findDOMNode(this.refs.star)) {
      this.props.onClick(this.props.ticker)
    }
  }

  @autobind
  onStarTickerListItem() {
    this.context.tickerStore.starCurrencyPair(this.props.ticker.currencyPair)
  }

  @autobind
  renderSparkline() {
    const sparkline = this.context.tickerStore.sparklines.get(this.props.ticker.currencyPair)
    if (sparkline) {
      const orders = this.context.accountStore.orders.filter(o => o.currencyPair === this.props.ticker.currencyPair)

      return (
        <TickerSparkline data={sparkline.data.toJS()} ticker={this.props.ticker}>
          {orders.map(o => (
            <ReferenceLine
              key={o.orderNumber}
              y={o.rate}
              stroke={o.type === 'sell' ? 'green' : 'red'}
            />
          ))}
        </TickerSparkline>
      )
    }

    return <LoadingView />
  }

  render() {
    const { ticker } = this.props
    const { tickerStore } = this.context
    const { quote, base, last, baseVolume, quoteVolume } = ticker

    return (
      <Row flex={1} onClick={this.onClick} style={{ height: 150, padding: 16, borderBottom: '1px solid #ddd', alignItems: 'center' }}>
        <Column style={{ width: 150 }}>
          <Row>
            <Spacer />
            <Column style={{ width: 18 }}>
              <Star ref="star" isStarred={tickerStore.isStarred(ticker.currencyPair)} onToggle={this.onStarTickerListItem} />
            </Column>
            <Column style={{ fontWeight: 'bold', textAlign: 'right', marginRight: 24 }}>{quote}</Column>
          </Row>

          <Row style={{ fontSize: 12 }}>
            <Spacer />
            <Blink>{numberToCurrency(last, base)}</Blink>
            <TrendIndicator value={last} />
          </Row>

          <Row style={{ fontSize: 10, color: '#aaa' }}>
            <Spacer />
            <Blink>{numberToCurrency(baseVolume, base, 0)}</Blink>
            <TrendIndicator value={baseVolume} />
          </Row>

          <Row style={{ fontSize: 10, color: '#aaa' }}>
            <Spacer />
            <Blink>{numberToCurrency(quoteVolume, quote, 0)}</Blink>
            <TrendIndicator value={quoteVolume} />
          </Row>
        </Column>

        <Gutter />

        <Column flex={1} style={{ alignItems: 'center' }}>
          {this.renderSparkline()}
        </Column>
      </Row>
    )
  }
}
