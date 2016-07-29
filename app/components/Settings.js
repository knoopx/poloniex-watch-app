import React from 'react'
import {autobind} from 'core-decorators'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import {Pane, Body, Header} from './Pane'
import {TextInput, Button, Box} from 'react-desktop/macOs'

@observer
export default class Settings extends React.PureComponent {
  @observable credentials = {
    key: '',
    secret: ''
  }

  static propTypes = {
    rootNavigation: React.PropTypes.object
  }

  static contextTypes = {
    accountStore: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    Object.assign(this.credentials, this.context.accountStore.credentials)
  }

  @autobind
  onClickBack() {
    this.props.rootNavigation.pop()
  }

  @autobind
  onClickSave() {
    this.context.accountStore.credentials = this.credentials
    this.props.rootNavigation.pop()
  }

  @autobind
  onChangeKey(e) {
    this.credentials.key = e.target.value
  }

  @autobind
  onChangeSecret(e) {
    this.credentials.secret = e.target.value
  }

  render() {
    return (
      <Pane>
        <Header onClick={this.onClickBack}>
          <i className="fa fa-chevron-left" style={{marginRight: 8}} />
          <strong>Settings</strong>
        </Header>
        <Body style={{padding: '24px 32px'}}>
          <Box>
            <TextInput label="Key" value={this.credentials.key} onChange={this.onChangeKey} marginBottom={16} />
            <TextInput label="Secret" value={this.credentials.secret} onChange={this.onChangeSecret} marginBottom={16} />
            <div><Button onClick={this.onClickSave}>Save</Button></div>
          </Box>
        </Body>
      </Pane>
    )
  }
}
