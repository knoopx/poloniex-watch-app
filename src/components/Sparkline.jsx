import React from 'react'
import { autobind } from 'core-decorators'

import * as ReStock from 'react-stockcharts/lib/indicator'
import { fitWidth } from 'react-stockcharts/lib/helper'
import * as d3 from 'd3'

import { Chart, Bar, Line, ReferenceLine } from './Chart'
import FlexibleLayout from './FlexibleLayout'

@fitWidth
export default class Sparkline extends React.PureComponent {
  static propTypes = {
    title: React.PropTypes.string,
    crosshair: React.PropTypes.object,
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    onMouseMove: React.PropTypes.func,
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    width: 400,
    height: 100
  }

  @autobind
  onMouseMove(e) {
    if (this.props.onMouseMove) {
      this.props.onMouseMove(Object.assign(e, {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        domainX: this.xScale.invert(e.nativeEvent.offsetX),
        domainY: this.yScale.invert(e.nativeEvent.offsetY)
      }))
    }
  }

  @autobind
  onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(Object.assign(e, {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        domainX: this.xScale.invert(e.nativeEvent.offsetX),
        domainY: this.yScale.invert(e.nativeEvent.offsetY)
      }))
    }
  }

  render() {
    const { data, width, height, children, crosshair, ...extraProps } = this.props

    ReStock.sma()
      .windowSize(20)
      .source(d => d.close)
      .merge((d, c) => { d.SMA = c })(data)

    let yMax = Math.max(...data.map(d => d.close))
    if (children) {
      yMax = Math.max(yMax, Math.max(...React.Children.map(children, c => c.props.y)))
    }
    const yExtent = [yMax, Math.min(...data.map(d => d.close))]

    this.xScale = d3.scaleLinear().range([0, width]).domain(d3.extent(data, d => d.date))
    this.yScale = d3.scaleLinear().range([0, height]).domain(yExtent)

    return (
      <Chart title={this.props.title} width={width} height={height} data={data} x={d => d.date.getTime()} xScale={this.xScale} {...extraProps} onClick={this.onClick} onMouseMove={this.onMouseMove}>
        <Bar y={d => d.volume} fill="#ddd" yScale={d3.scaleLinear().range([0, height]).domain(d3.extent(data, d => d.volume))} />
        {crosshair && <Line stroke="#aaa" shapeRendering="crispEdges" strokeDasharray="2,1" y={() => crosshair.y} yScale={this.yScale} />}
        {crosshair && <Line stroke="#aaa" shapeRendering="crispEdges" strokeDasharray="2,1" x={() => crosshair.x} xScale={this.xScale} y={(d, index) => index} yScale={d3.scaleLinear().range([0, height]).domain([0, data.length - 1])} />}
        <Line stroke="#848484" y={d => d.close} yScale={this.yScale} children={children} />
        <Line strokeWidth={2} y={d => d.SMA} yScale={this.yScale} />
      </Chart>
    )
  }
}
