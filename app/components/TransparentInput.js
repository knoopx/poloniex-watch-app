import React from 'react'

export default class TransparentInput extends React.PureComponent {
  static defaultProps = {
    type: 'text'
  }

  render() {
    return (
      <input style={{flex: 1, outline: 'none', border: 'none', background: 'none', fontSize: '14px'}} {...this.props} />
    )
  }
}
