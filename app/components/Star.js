import React from 'react'
import {autobind} from 'core-decorators'

export default class Star extends React.PureComponent {
  static propTypes = {
    isStarred: React.PropTypes.bool,
    onToggle: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    isStarred: false
  }

  @autobind
  onClick() {
    this.props.onToggle(!this.props.isStarred)
  }

  render() {
    const className = this.props.isStarred ? 'fa fa-star' : 'fa fa-star-o'
    return <i className={className} onClick={this.onClick} />
  }
}
