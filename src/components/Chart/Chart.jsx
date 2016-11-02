import React from 'react'

export default class Chart extends React.PureComponent {
  static propTypes = {
    title: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: React.PropTypes.array.isRequired,
    x: React.PropTypes.func.isRequired,
    xScale: React.PropTypes.func.isRequired
  }

  render() {
    const { title, legend, width, height, data, x, xScale, onClick, onMouseMove, children, ...extraProps } = this.props

    return (
      <svg {...{ width, height, onClick, onMouseMove }} {...extraProps}>
        {React.Children.map(children, child => child && React.cloneElement(child, { width, height, data, x, xScale, ...child.props }))}
        {title && <text x={0} y={10} fontSize={10} fontWeight="bold">{title}</text>}
        {legend && <g x={0} y={10} fontSize={10} fontWeight="bold">{legend}</g>}
      </svg>
    )
  }
}
