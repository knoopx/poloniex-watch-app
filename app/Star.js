import React from 'react';
import PureRendererMixin from 'react-addons-pure-render-mixin'

export default React.createClass({
  propTypes: {
    isStarred: React.PropTypes.bool,
    onToggle: React.PropTypes.func.isRequired,
  },

  mixins: [PureRendererMixin],

  getDefaultProps() {
    return {
      isStarred: false
    }
  },

  onClick() {
    this.props.onToggle(!this.props.isStarred)
  },

  render() {
    const className = this.props.isStarred ? 'fa fa-star' : 'fa fa-star-o'
    return <i className={className} onClick={this.onClick} />
  }
})
