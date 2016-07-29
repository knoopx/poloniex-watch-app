import React from 'react';
import PureRendererMixin from 'react-addons-pure-render-mixin'
import {Pane, Body, Header} from './Pane'
import {TextInput, Button, Box} from 'react-desktop/macOs';

export default React.createClass({
  propTypes: {
    settings: React.PropTypes.object.isRequired,
    rootNavigation: React.PropTypes.object
  },

  mixins: [PureRendererMixin],

  getInitialState() {
    const {key, secret} = this.props.settings.get('credentials', {
      key: '',
      secret: ''
    })
    return {key, secret}
  },

  onClickBack() {
    this.props.rootNavigation.pop()
  },

  onClickSave() {
    const {key, secret} = this.state
    this.props.settings.set('credentials', {key, secret})
    this.props.rootNavigation.pop()
  },

  onChangeKey(e) {
    this.setState({key: e.target.value})
  },

  onChangeSecret(e) {
    this.setState({secret: e.target.value})
  },

  render() {
    return (
      <Pane>
        <Header onClick={this.onClickBack}>
          <i className="fa fa-chevron-left" style={{marginRight: 8}} />
          <strong>Settings</strong>
        </Header>
        <Body style={{padding: '24px 32px'}}>
          <Box>
            <TextInput label="Key" value={this.state.key} onChange={this.onChangeKey} marginBottom={16} />
            <TextInput label="Secret" value={this.state.secret} onChange={this.onChangeSecret} marginBottom={16} />
            <div><Button onClick={this.onClickSave}>Save</Button></div>
          </Box>
        </Body>
      </Pane>
    )
  }
})
