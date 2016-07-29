import React from 'react'
import {autobind} from 'core-decorators'
import {numberToCurrency} from '../services/Helper'
import TransparentInput from './TransparentInput'
import {Row, Column, Gutter, Spacer} from './Layout'

export default class CurrencyInput extends React.PureComponent {
  state = {
    isEditing: false
  }

  @autobind
  onChange(e) {
    this.props.onChange(e.target.valueAsNumber)
  }

  @autobind
  onFocus() {
    this.setState({isEditing: true})
  }

  @autobind
  onBlur() {
    this.setState({isEditing: false})
  }

  render() {
    const {value, symbol, ...props} = this.props
    const displayValue = this.state.isEditing ? value : numberToCurrency(value)
    return (
      <Row flex={1} style={{alignItems: 'center', border: '1px solid #ddd', padding: '4px 8px'}}>
        <Column style={{color: '#aaa'}}>{symbol}</Column>
        <Gutter size={4} />
        <Column flex={1}>
          <TransparentInput type="number" step="0.0000005" value={displayValue} {...props} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} />
        </Column>
      </Row>
    )
  }
}
