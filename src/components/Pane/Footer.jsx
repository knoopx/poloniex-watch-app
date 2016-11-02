import React from 'react'

export default class Footer extends React.PureComponent {
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
      borderTop: '1px solid #bbb',
      alignItems: 'center',
      height: 40
    }

    const { onClick } = this.props

    return (
      <div style={style} {...{ onClick }}>
        {this.props.children}
      </div>
    )
  }
}
