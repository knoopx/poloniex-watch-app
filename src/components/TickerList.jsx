import React from 'react'
import { autobind } from 'core-decorators'
import { observer } from 'mobx-react'

import VirtualList from './VirtualList'
import Ticker from './Ticker'
import TickerListItem from './TickerListItem'
import TabButton from './TabButton'
import Star from './Star'
import { Pane, Body, Header } from './Pane'
import { Gutter } from './Layout'
import FilterInput from './FilterInput'

@observer
export default class TickerList extends React.PureComponent {
  static propTypes = {
    navigation: React.PropTypes.object
  }

  static contextTypes = {
    tickerStore: React.PropTypes.object.isRequired
  }

  @autobind
  onToggleStarred(value) {
    this.context.tickerStore.filter.shouldShowOnlyStarred = value
  }

  @autobind
  onClickTickerListItem(ticker) {
    this.props.navigation.push({ component: Ticker, props: { ticker } })
  }

  @autobind
  renderTickerListItem(ticker) {
    return (
      <TickerListItem
        key={ticker.currencyPair}
        onClick={this.onClickTickerListItem}
        ticker={ticker}
      />
    )
  }

  @autobind
  renderMarketTab(market) {
    const { tickerStore } = this.context
    const count = tickerStore.filterTickers(market).length
    return (
      <TabButton
        key={market}
        onClick={() => { tickerStore.market = market }}
        active={tickerStore.market === market}
        count={count}
      >
        {market}
      </TabButton>
    )
  }

  render() {
    const { tickerStore } = this.context
    const { filter, matches } = tickerStore
    return (
      <Pane>
        <Header>
          <FilterInput placeholder="Filter..." value={filter.query} onChange={(value) => { tickerStore.filter.query = value }} />
          <Gutter />
          {tickerStore.markets.map(this.renderMarketTab).reduce((arr, item, i) => ([...arr, <Gutter key={i} size={8} />, item]), [])}
          <Gutter />
          <Star isStarred={filter.shouldShowOnlyStarred} onToggle={this.onToggleStarred} />
        </Header>
        <Body style={{ display: 'flex', overflow: 'hidden' }}>
          <VirtualList
            items={matches}
            itemHeight={150}
            renderItem={this.renderTickerListItem}
          />
        </Body>
      </Pane>
    )
  }
}
