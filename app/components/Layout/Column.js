import React from 'react'

export default class Column extends React.PureComponent {
  static propTypes = {
    flex: React.PropTypes.any
  }

  render() {
    const {flex, ...extraProps} = this.props
    return (
      <div {...extraProps} style={{flex, display: 'flex', flexDirection: 'column', ...extraProps.style}} />
    )
  }
}
