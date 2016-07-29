import React from 'react'
import math from 'mathjs'
import Sparkline from './Sparkline'
import {ReferenceLine} from './Chart'

export default class TickerSparkline extends React.PureComponent {
  static propTypes = {
    ticker: React.PropTypes.object.isRequired,
    title: React.PropTypes.string,
    crosshair: React.PropTypes.object,
    data: React.PropTypes.array.isRequired,
    onMouseMove: React.PropTypes.func,
    onClick: React.PropTypes.func,
  }

  static contextTypes = {
    accountStore: React.PropTypes.object.isRequired
  }

  render() {
    const {data, children, ticker, ...extraProps} = this.props
    const referenceLines = React.Children.toArray(children)
    referenceLines.push(<ReferenceLine stroke="#aaa" strokeDasharray="10,1,3,1" y={math.mean(data.map(d => d.close))} />)
    const last = this.context.accountStore.getLastPurchaseRate(ticker.currencyPair)
    if (last) {
      referenceLines.push(<ReferenceLine stroke="#ceb300" strokeOpacity={0.5} y={last} />)
    }

    return (
      <Sparkline data={data} children={referenceLines} {...extraProps} />
    )
  }
}
