import {autobind} from 'core-decorators'
import {observable, computed, asMap, autorun} from 'mobx'
import Exchange from '../services/Exchange'
import Storage from '../services/Storage'
import firstBy from 'thenby'

class ObservableList {
  @observable items = []

  has(item) {
    return this.items.indexOf(item) >= 0
  }

  add(item) {
    this.items.push(item)
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1)
  }
}

class ObservableSet extends ObservableList {
  add(item) {
    if (!this.has(item)) {
      this.items.push(item)
    }
  }
}

class TickerStore {
  @observable refreshRate = 1000 * 60
  @observable tickerMap = asMap()
  @observable starredCurrencyPairs = new ObservableSet()
  @observable sparklines = asMap()

  @observable filter = Storage.get('filter', {
    query: '',
    shouldShowOnlyStarred: false
  })

  markets = ['BTC', 'ETH', 'XMR', 'USDT']
  @observable market = this.markets[0]

  constructor() {
    Storage.get('starredCurrencyPairs', []).forEach((pair) => this.starredCurrencyPairs.add(pair))
    this.fetchTickersAndSubcribe()

    autorun(() => {
      const {query, shouldShowOnlyStarred} = this.filter
      Storage.set('filter', {query, shouldShowOnlyStarred})
      Storage.set('starredCurrencyPairs', this.starredCurrencyPairs.items)
    })
  }

  @computed get tickers() {
    return [...this.tickerMap.values()]
  }

  @computed get matches() {
    return this.filterTickers(this.market)
  }

  filterTickers(market) {
    const query = this.filter.query.toLocaleLowerCase()
    return this.tickers
    .filter(ticker => ticker.base === market)
    .filter(ticker => (this.filter.shouldShowOnlyStarred ? this.isStarred(ticker.currencyPair) : true))
    .filter(ticker => (query.length > 0 ? ticker.currencyPair.toLocaleLowerCase().indexOf(query) > -1 : true))
    .sort(firstBy('percentChange', -1))
  }

  getLast(currencyPair) {
    const ticker = this.tickerMap.get(currencyPair)
    return ticker ? ticker.last : 0.0
  }

  async fetchTickersAndSubcribe() {
    const tickers = await Exchange.fetchTickers()
    this.tickerMap.merge(tickers)
    this.tickerMap.values().map((ticker) => this.updateSparklineData(ticker.currencyPair))
    Exchange.subscribe(this.updateTickerListItem)
  }

  @autobind
  updateTickerListItem(ticker) {
    this.tickerMap.set(ticker.currencyPair, ticker)
    this.updateSparklineData(ticker.currencyPair)
  }

  isStarred(currencyPair) {
    return this.starredCurrencyPairs.has(currencyPair)
  }

  async starCurrencyPair(currencyPair) {
    if (this.starredCurrencyPairs.has(currencyPair)) {
      this.starredCurrencyPairs.remove(currencyPair)
    } else {
      this.starredCurrencyPairs.add(currencyPair)
    }
  }

  async updateSparklineData(currencyPair) {
    const sparkline = this.sparklines.get(currencyPair)
    if (sparkline && (Date.now() - sparkline.updatedAt < this.refreshRate)) {
      return
    }
    const data = await this.fetchSparklineData(currencyPair)
    this.sparklines.set(currencyPair, {data, updatedAt: Date.now()})
  }

  async fetchSparklineData(currencyPair) {
    const data = await Exchange.fetchChartData(currencyPair, 60 * 60 * 24)
    return data
  }
}

export default new TickerStore()
