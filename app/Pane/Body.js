import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <div style={{flex: 1, overflow: 'auto', ...this.props.style}}>
        {this.props.children}
      </div>
    )
  }
}
