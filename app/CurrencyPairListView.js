import React from 'react'
import PureRendererMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import firstBy from 'thenby'

import Star from './Star'
import CurrencyPairView from './CurrencyPairView'
import CurrencyPairListItem from './CurrencyPairListItem'
import {Pane, Body, Header} from './Pane'
import {Gutter} from './Layout'

export default React.createClass({
  propTypes: {
    watcher: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
    trader: React.PropTypes.object.isRequired,
    navigation: React.PropTypes.object
  },

  mixins: [PureRendererMixin],

  getInitialState() {
    return {
      filter: '',
      shouldShowOnlyStarred: this.props.settings.get('shouldShowOnlyStarred', false),
      starredCurrencyPairs: Immutable.Set(this.props.settings.get('starredCurrencyPairs', [])),
      tickers: this.props.watcher.tickers,
    }
  },

  componentWillMount() {
    this.props.watcher.on('tickers', this.onTickers)
  },

  componentWillUnmount() {
    this.props.watcher.off('tickers', this.onTickers)
  },

  onTickers(tickers) {
    this.setState({tickers})
  },

  onToggleShouldShowOnlyStarred(value) {
    this.props.settings.set('shouldShowOnlyStarred', value)
    this.setState({shouldShowOnlyStarred: value})
  },

  onChangeFilter(e) {
    this.setState({filter: e.target.value})
  },

  onToggleCurrencyPair(currencyPair) {
    const {starredCurrencyPairs} = this.state
    let newStarredCurrencyPairs

    if (starredCurrencyPairs.includes(currencyPair.key)) {
      newStarredCurrencyPairs = starredCurrencyPairs.delete(currencyPair.key)
    } else {
      newStarredCurrencyPairs = starredCurrencyPairs.add(currencyPair.key)
    }

    this.props.settings.set('starredCurrencyPairs', newStarredCurrencyPairs.toJS())
    this.setState({starredCurrencyPairs: newStarredCurrencyPairs})
  },

  onClickRow(currencyPair) {
    this.props.navigation.push({component: CurrencyPairView, props: {currencyPair}})
  },

  renderCurrencyPair(currencyPair) {
    return (
      <CurrencyPairListItem
        key={currencyPair.key}
        onClick={this.onClickRow}
        currencyPair={currencyPair}
        watcher={this.props.watcher}
        trader={this.props.trader}
        isStarred={this.state.starredCurrencyPairs.includes(currencyPair.key)}
        onToggle={this.onToggleCurrencyPair}
      />
    )
  },

  render() {
    const {trader} = this.props
    const filter = this.state.filter.toLocaleLowerCase()
    const matches = this.state.tickers
      .filter(p => this.state.shouldShowOnlyStarred ? this.state.starredCurrencyPairs.includes(p.key) : true)
      .filter(p => this.state.filter.length > 0 ? p.key.toLocaleLowerCase().indexOf(filter) > -1 : true)

    return (
      <Pane>
        <Header>
          <input style={{flex: 1, outline: 'none', border: 'none', background: 'none', cursor: 'text', fontSize: '18px'}} type="text" placeholder={'Filter...'} value={this.state.filter} onChange={this.onChangeFilter} />
          <Gutter />
          <Star isStarred={this.state.shouldShowOnlyStarred} onToggle={this.onToggleShouldShowOnlyStarred} />
        </Header>
        <Body>
          {matches.sort(firstBy('percentChange', -1)).map(this.renderCurrencyPair).toArray()}
        </Body>
      </Pane>
    )
  }
})
