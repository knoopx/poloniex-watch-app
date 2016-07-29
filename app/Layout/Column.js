import React from 'react'

export default React.createClass({
  propTypes: {
    flex: React.PropTypes.any
  },

  render() {
    const {flex, ...props} = this.props
    return (
      <div {...props} style={{flex, display: 'flex', flexDirection: 'column', ...props.style}} />
    )
  }
})
