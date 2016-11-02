import React from 'react'
import math from 'mathjs'
import { observable, computed, transaction } from 'mobx'
import { observer } from 'mobx-react'

import { numberColor, changePercent, numberToPercentage, trendSymbol } from '../services/Helper'

@observer
export default class TrendIndicator extends React.PureComponent {
  @observable history = []

  static propTypes = {
    value: React.PropTypes.number.isRequired,
    limit: React.PropTypes.number.isRequired
  }

  static defaultProps = {
    limit: 25
  }

  componentWillReceiveProps(nextProps) {
    transaction(() => {
      this.history.push(nextProps.value)
      if (this.history.length > this.props.limit) {
        this.history.pop()
      }
    })
  }

  @computed get diff() {
    if (this.history.length > 0) {
      return math.mean(this.history.toJS()) - this.props.value
    }
    return 0
  }

  render() {
    const tille = numberToPercentage(changePercent(this.props.value, this.props.value + this.diff))
    return <span title={tille} style={{ color: numberColor(this.diff), width: 16, textAlign: 'center', alignSelf: 'center', margin: '0 4px', ...this.props.style }}>{trendSymbol(this.diff)}</span>
  }
}
