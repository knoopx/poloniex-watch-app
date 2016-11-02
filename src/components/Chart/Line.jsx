import React from 'react'
import { line, scaleLinear, extent } from 'd3'

export default class Line extends React.PureComponent {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    data: React.PropTypes.array,
    x: React.PropTypes.func,
    y: React.PropTypes.func.isRequired,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func.isRequired
  }

  render() {
    const { width, height, data, x, y, xScale, yScale, style, children, ...extraProps } = this.props
    const points = data.map((d, i) => [xScale(x(d, i)), yScale(y(d, i))]).filter(p => p[0] && p[1])

    return (
      <g>
        {React.Children.map(children, child => React.cloneElement(child, { width, height, yScale, style, ...child.props }))}
        <path fill="transparent" stroke="#549be4" {...extraProps} d={line()(points)} />
      </g>
    )
  }
}
