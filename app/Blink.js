import React from 'react';
import PureRendererMixin from 'react-addons-pure-render-mixin'
import _ from 'underscore'

import styles from './Blink.scss'

export default React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },

  mixins: [PureRendererMixin],

  componentWillUpdate(nextProps) {
    if (!_.isEqual(nextProps.children, this.props.children)) {
      this.refs.target.classList.add(styles.in)
      setTimeout(() => {
        if (this.refs.target) {
          this.refs.target.classList.remove(styles.in)
        }
      }, 500)
    }
  },

  render() {
    return <div ref="target" {...this.props} />
  }
})
