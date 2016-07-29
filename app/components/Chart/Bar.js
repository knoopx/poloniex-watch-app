import React from 'react'
import {scaleLinear, extent} from 'd3'

export default class Bar extends React.PureComponent {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    data: React.PropTypes.array,
    x: React.PropTypes.func,
    y: React.PropTypes.func.isRequired,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func.isRequired,
  }

  render() {
    const {width, height, data, x, y, xScale, yScale, ...extraProps} = this.props

    return (
      <g>
        {data.map((d, index) => <rect key={index} fill="dodgerblue" x={xScale(x(d))} shapeRendering="crispEdges" {...extraProps} width={Math.ceil(width / data.length)} y={height - yScale(y(d))} height={yScale(y(d))} />)}
      </g>
    )
  }
}
