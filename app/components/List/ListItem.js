import React from 'react'
import {Row, Column, Gutter, Spacer} from '../Layout'

export default class ListItem extends React.PureComponent {
  render() {
    const {style, ...extraProps} = this.props

    return (
      <Row flex={1} {...extraProps} style={{padding: '8px 16px', borderBottom: '1px solid #ddd', alignItems: 'center', ...style}} />
    )
  }
}
