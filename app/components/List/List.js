import React from 'react'
import {Row, Column, Gutter, Spacer} from '../Layout'

export default class List extends React.PureComponent {
  render() {
    return (
      <Column flex={1} {...this.props} />
    )
  }
}
