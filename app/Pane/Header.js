import React from 'react'

export default class extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
    onClick: React.PropTypes.func
  }

  render() {
    const style = {
      display: 'flex',
      flexDirection: 'row',
      padding: '8px 16px',
      backgroundColor: '#eee',
      fontSize: 14,
      borderBottom: '1px solid #bbb',
      alignItems: 'center',
      height: 20
    }

    const {onClick} = this.props

    return (
      <div style={style} {...{onClick}}>
        {this.props.children}
      </div>
    )
  }
}
