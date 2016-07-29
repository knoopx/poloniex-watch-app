import React from 'react'
import {autobind} from 'core-decorators'
import {Row, Gutter} from './Layout'
import TransparentInput from './TransparentInput'

export default class FilterInput extends React.PureComponent {
  state = {
    value: this.props.value
  }

  @autobind
  onClickClear(e) {
    this.setState({value: ''}, () => this.props.onChange(this.state.value))
  }

  @autobind
  onChange(e) {
    this.setState({value: e.target.value}, () => this.props.onChange(this.state.value))
  }

  @autobind
  renderIcon() {
    if (this.props.value.length > 0) {
      return <i className="fa fa-times-circle" onClick={this.onClickClear} />
    }
    return <i className="fa fa-search" />
  }

  render() {
    return (
      <Row flex={1} style={{alignItems: 'center'}}>
        {this.renderIcon()}
        <Gutter size={8} />
        <TransparentInput ref="input" {...this.props} value={this.state.value} onChange={this.onChange} />
      </Row>
    )
  }
}
