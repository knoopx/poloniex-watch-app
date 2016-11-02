import React from 'react'
import { Row, Gutter } from './Layout'

export default class Tab extends React.PureComponent {
  render() {
    const { children, onClick, active, count } = this.props

    const styles = {
      default: {
        padding: '4px 16px',
        alignItems: 'flex-end',
        backgroundColor: '#ddd',
        borderRadius: '16px'
      },
      active: {
        color: 'white',
        backgroundColor: '#aaa'
      }
    }

    return (
      <Row onClick={onClick} style={{ ...styles.default, ...(active ? styles.active : {}) }}>
        <span style={{ fontWeight: 'bold' }}>{children}</span>
        <Gutter size={8} />
        <span style={{ fontSize: 12 }}>{count}</span>
      </Row>
    )
  }
}
