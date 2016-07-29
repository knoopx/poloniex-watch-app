import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        {this.props.children}
      </div>
    )
  }
}
