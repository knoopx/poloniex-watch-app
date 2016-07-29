import React from 'react'

export default class Gutter extends React.PureComponent {
  static propTypes = {
    size: React.PropTypes.number.isRequired
  }

  static defaultProps = {
    size: 16
  }

  render() {
    return (
      <div style={{width: this.props.size}} />
    )
  }
}
