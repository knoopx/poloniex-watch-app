import React from 'react'
import {findDOMNode} from 'react-dom'
import PureRendererMixin from 'react-addons-pure-render-mixin'
import {Sparklines, SparklinesLine} from 'react-sparklines'
import {ProgressCircle} from 'react-desktop/macOs'

import {Row, Column, Gutter, Spacer} from './Layout'
import FlexibleLayout from './FlexibleLayout'
import Blink from './Blink'
import Star from './Star'

export default React.createClass({
  propTypes: {
    watcher: React.PropTypes.object.isRequired,
    trader: React.PropTypes.object.isRequired,
    currencyPair: React.PropTypes.object.isRequired,
    isStarred: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
    onToggle: React.PropTypes.func.isRequired
  },

  mixins: [PureRendererMixin],

  getDefaultProps() {
    return {
      isStarred: false
    }
  },

  getInitialState() {
    return {
      isLoading: true,
      data: []
    }
  },

  componentWillMount() {
    this.fetchSparklineData()
    this.interval = setInterval(this.fetchSparklineData, 5000)
  },

  componentWillUnmount() {
    clearInterval(this.interval)
  },

  onClick(e) {
    if (e.target !== findDOMNode(this.refs.star)) {
      this.props.onClick(this.props.currencyPair)
    }
  },

  onToggle() {
    this.props.onToggle(this.props.currencyPair)
  },

  fetchSparklineData() {
    this.props.watcher.fetchChartData(this.props.currencyPair.key, 60 * 60 * 24).then((data) => {
      this.setState({isLoading: false, data: data.map(d => d.close)})
    })
  },

  renderSparkline(layout) {
    if (this.state.isLoading) {
      return <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}><ProgressCircle size={25} /></div>
    }

    return (
      <Sparklines width={layout.width} svgWidth={layout.width} height={70} svgHeight={70} data={this.state.data}>
        <SparklinesLine style={{fill: '#e7f3f8', fillOpacity: 1, stroke: '#3d90c2', strokeWidth: 1}} />
      </Sparklines>
    )
  },

  render() {
    const {currencyPair, trader} = this.props
    const {name, currency, market, last, percentChange} = currencyPair
    const color = percentChange == 0 ? 'black' : (percentChange > 0 ? 'green' : 'red')
    const trendSymbol = percentChange > 0 ? '+' : ''

    return (
      <Row onClick={this.onClick} style={{display: 'flex', flex: 1, padding: 16, borderBottom: '1px solid #eee', alignItems: 'center'}}>
        <Column style={{width: 150}}>
          <Row>
            <Column><Star ref="star" isStarred={this.props.isStarred} onToggle={this.onToggle} /></Column>
            <Spacer />
            <Column style={{fontWeight: 'bold', textAlign: 'right'}}>{name}</Column>
          </Row>

          <Row style={{fontSize: 14, color}}>
            <Spacer />
            <Blink>{last.toFixed(8)}</Blink>
          </Row>

          <Row style={{fontSize: 10, color}}>
            <Spacer />
            <Blink>{trendSymbol}{percentChange.toFixed(2)}%</Blink>
          </Row>

          <Row style={{fontSize: 10}}>
            <Spacer />
            <Column>
              <Row style={{display: "block", textAlign: 'right'}}>{currency}</Row>
              <Row style={{display: "block", textAlign: 'right'}}>{market}</Row>
            </Column>
            <Gutter />
            <Column>
              <Row style={{display: "block", textAlign: 'right'}}>{trader.getAvailableBalance(currency).toFixed(8)}</Row>
              <Row style={{display: "block", textAlign: 'right'}}>{trader.getAvailableBalance(market).toFixed(8)}</Row>
            </Column>
          </Row>
        </Column>

        <Gutter />

        <Column flex={1} style={{alignItems: 'center'}}>
          <FlexibleLayout render={this.renderSparkline} />
        </Column>
      </Row>
    )
  }
})
