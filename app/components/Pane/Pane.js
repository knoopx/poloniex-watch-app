import React from 'react'

export default class Pane extends React.PureComponent {
  render() {
    return (
      <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        {this.props.children}
      </div>
    )
  }
}
