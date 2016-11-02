import React from 'react'
import { isEqual } from 'lodash'
import styles from './Blink.scss'

export default class Blink extends React.PureComponent {
  static propTypes = {
    children: React.PropTypes.any
  }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.children, this.props.children)) {
      this.refs.target.classList.add(styles.in)
      setTimeout(() => {
        if (this.refs.target) {
          this.refs.target.classList.remove(styles.in)
        }
      }, 500)
    }
  }

  render() {
    return <span ref="target" {...this.props} />
  }
}
