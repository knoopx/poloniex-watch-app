import React from 'react';
import {findDOMNode} from 'react-dom';

export default React.createClass({
  propTypes: {
    render: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {}
  },

  componentDidMount() {
    this.updateLayout()
    window.addEventListener('resize', this.updateLayout);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout);
  },

  updateLayout() {
    this.setState({
      isUpdating: true
    }, () => {
      requestAnimationFrame(() => {
        const el = findDOMNode(this)
        if (el) {
          this.setState({
            isUpdating: false,
            layout: {
              width: el.parentNode.clientWidth,
              height: el.parentNode.clientHeight,
            }
          })
        }
      })
    })
  },

  render() {
    if (!this.state.layout || this.state.isUpdating) { return <noscript /> }
    return this.props.render(this.state.layout)
  }
})
