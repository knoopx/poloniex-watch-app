import React from 'react'

export default class Body extends React.PureComponent {
  render() {
    return (
      <div style={{flex: 1, overflow: 'auto', ...this.props.style}}>
        {this.props.children}
      </div>
    )
  }
}
