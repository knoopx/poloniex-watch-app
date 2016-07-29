import {observable, computed, asMap, autorun} from 'mobx'
import {autobind} from 'core-decorators'
import Account from '../services/Account'
import Storage from '../services/Storage'
import firstBy from 'thenby'
import tickerStore from './TickerStore'

class AccountStore {
  @observable credentials = Storage.get('credentials', {
    key: '',
    secret: ''
  })
  @observable orderMap = asMap()
  @observable balanceMap = asMap()
  @observable tradeHistoryMap = asMap()

  constructor() {
    autorun(() => {
      clearInterval(this.interval)
      this.refreshAccount()
      setInterval(this.refreshAccount, 5000)
    })
  }

  async cancelOrder(orderNumber) {
    await this.account.cancelOrder(orderNumber)
    this.refreshAccount()
  }

  @autobind
  async refreshAccount() {
    const {key, secret} = this.credentials
    if (key.length > 0 && secret.length > 0) {
      Storage.set('credentials', this.credentials)
      this.account = new Account(this.credentials)
      this.balanceMap.merge(await this.account.fetchBalances())
      this.orderMap.merge(await this.account.fetchOrders())
      this.tradeHistoryMap.merge(await this.account.fetchTradeHistory())
    }
  }

  @computed get balances() {
    return this.balanceMap.entries()
      .filter(([quote]) => tickerStore.markets.some((market) => this.getHistory(`${market}_${quote}`).length > 0))
      .map(([quote, props]) => ({quote, ...props}))
      .sort(firstBy('btcValue'))
  }

  @computed get orders() {
    return this.orderMap.entries()
      .reduce((result, [currencyPair, orders]) => result.concat(orders.map((order) => ({currencyPair, ...order}))), [])
      .sort(firstBy('date', -1))
  }

  @computed get tradeHistory() {
    return this.tradeHistoryMap.entries()
      .reduce((result, [currencyPair, orders]) => result.concat(orders.map((order) => ({currencyPair, ...order}))), [])
      .sort(firstBy('date', -1))
  }

  getHistory(currencyPair) {
    const history = this.tradeHistoryMap.get(currencyPair)
    return history ? [...history.values()].sort(firstBy('date', -1)) : []
  }

  getLastPurchaseRate(currencyPair) {
    const history = this.getHistory(currencyPair).filter(o => o.type === 'buy').map(o => o.rate)
    if (history.length > 0) {
      return history[0]
    }

    return 0.0
  }

  getProfit(currencyPair) {
    const history = this.getHistory(currencyPair)
    if (history.length > 0) {
      return history.reduce((total, o) => (o.type === 'sell' ? total + o.total : total - o.total), 0)
    }

    return 0.0
  }

  getAvailableBalance(currencyPair) {
    const balance = this.balanceMap.get(currencyPair)
    if (balance) { return balance.available }
    return 0.0
  }

  async buy(currencyPair, rate, amount) {
    await this.account.buy(currencyPair, rate, amount)
    this.refreshAccount()
  }

  async sell(currencyPair, rate, amount) {
    await this.account.sell(currencyPair, rate, amount)
    this.refreshAccount()
  }
}

export default new AccountStore()
