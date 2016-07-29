import React from 'react'
import firstBy from 'thenby'
import math from 'mathjs'
import {observable, computed, asMap} from 'mobx'
import {observer} from 'mobx-react'
import {autobind} from 'core-decorators'

import TickerSparkline from './TickerSparkline'
import {ReferenceLine} from './Chart'

import Blink from './Blink'
import TrendIndicator from './TrendIndicator'
import LoadingView from './LoadingView'
import BuyPane from './BuyPane'
import SellPane from './SellPane'
import {Pane, Header, Body} from './Pane'
import {Row, Column, Gutter, Divider} from './Layout'

import Exchange from '../services/Exchange'
import {numberColor, changePercent, numberToPercentage, numberToCurrency} from '../Services/Helper'

@observer
export default class Ticker extends React.PureComponent {
  @observable crosshair

  // 300, 900, 1800, 7200, 14400, and 86400
  @observable dataMap = asMap({
    '6h': {
      start: 21600,
      period: 300,
      data: []
    },
    '1d': {
      start: 86400,
      // period: 900,
      period: 300,
      data: []
    },
    '1w': {
      start: 604800,
      // period: 7200,
      period: 1800,
      data: []
    },
    '1m': {
      start: 2.628e+6,
      // period: 14400,
      period: 7200,
      data: []
    }
  })

  static propTypes = {
    ticker: React.PropTypes.object.isRequired,
    navigation: React.PropTypes.object
  }

  static contextTypes = {
    accountStore: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    this.fetchData()
    this.interval = setInterval(this.fetchData, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  @autobind
  async fetchData() {
    this.dataMap.entries().forEach(([name, {start, period}]) => {
      Exchange.fetchChartData(this.props.ticker.currencyPair, start, period).then(data => {
        this.dataMap.set(name, {name, data, start, period})
      })
    })
  }

  @autobind
  onClickBack() {
    this.props.navigation.pop()
  }

  @computed get data() {
    return this.dataMap.entries().map(([name, params]) => ({name, ...params})).sort(firstBy('start'))
  }

  @autobind
  onMouseMove(e) {
    requestAnimationFrame(() => {
      this.crosshair = {x: e.domainX, y: e.domainY}
    })
  }

  @autobind
  onClick(e) {
    this.refs.buyPane.rate = parseFloat(e.domainY.toPrecision(8))
    this.refs.sellPane.rate = parseFloat(e.domainY.toPrecision(8))
  }

  @autobind
  renderLegend() {
    if (!this.crosshair) { return null }
    return (
      <text>{this.crosshair.domainY}</text>
    )
  }

  renderTicker(name, data) {
    return (
      <TickerSparkline
        title={name}
        legend={this.renderLegend()}
        data={data.toJS()}
        ticker={this.props.ticker}
        onClick={this.onClick}
        onMouseMove={this.onMouseMove}
        crosshair={this.crosshair}
        style={{cursor: 'crosshair'}}
      >
        <ReferenceLine stroke="red" strokeOpacity={0.5} y={this.refs.buyPane.rate} />
        <ReferenceLine stroke="green" strokeOpacity={0.5} y={this.refs.sellPane.rateWithProfit} />
      </TickerSparkline>
    )
  }

  @autobind
  renderWindow(props) {
    const {name, data} = props

    return (
      <Column key={name} style={{height: 150, padding: 16, borderBottom: '1px solid #ddd'}}>
        <Row flex={1}>
          {data.length > 0 ? this.renderTicker(name, data) : <LoadingView />}
        </Row>
      </Column>
    )
  }

  render() {
    const {ticker} = this.props

    return (
      <Pane>
        <Header onClick={this.onClickBack}>
          <i className="fa fa-chevron-left" style={{marginRight: 8}} />
          <strong>{this.props.ticker.name}</strong>
        </Header>
        <Column flex={1}>
          <Row flex={1}>
            <Body flex={1}>{this.data.map(this.renderWindow)}</Body>
          </Row>
          <Divider direction="horizontal" />
          <Row>
            <Column flex={1}>
              <BuyPane ref="buyPane" ticker={ticker} />
            </Column>
            <Divider direction="vertical" />
            <Column flex={1}>
              <SellPane ref="sellPane" ticker={ticker} />
            </Column>
          </Row>
        </Column>
      </Pane>
    )
  }
}
