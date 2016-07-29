import React from 'react'

import {ProgressCircle} from 'react-desktop/macOs'
import {Row} from './Layout'

export default class LoadingView extends React.PureComponent {
  render() {
    return (
      <Row flex={1} style={{alignItems: 'center', justifyContent: 'space-around'}}>
        <ProgressCircle size={25} />
      </Row>
    )
  }
}
