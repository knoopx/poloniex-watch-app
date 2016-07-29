import React from 'react';
import PureRendererMixin from 'react-addons-pure-render-mixin'
import {ProgressCircle} from 'react-desktop/macOs'
import {Row} from './Layout'

export default React.createClass({
  mixins: [PureRendererMixin],

  render() {
    return (
      <Row flex={1} style={{alignItems: 'center', justifyContent: 'space-around'}}>
        <ProgressCircle size={50} />
      </Row>
    );
  }
})
