import Immutable from 'immutable'
import plnx from 'plnx'
import {Emitter} from 'event-kit'
import math from 'mathjs'

export default class extends Emitter {
  windowSize = 100 // points

  constructor(watcher, settings) {
    super()

    this.watcher = watcher
    this.settings = settings
    this.orders = Immutable.Map()
    this.balances = Immutable.Map()
    this.priceHistory = Immutable.Map()
    this.tradeHistory = Immutable.Map()

    this.refreshBalances()
    this.refreshOrders()
    setInterval(this.refreshBalances.bind(this), 5000)
    setInterval(this.refreshOrders.bind(this), 5000)

    watcher.on('ticker', this.onTicker.bind(this))
  }

  fetchTradeHistory(currencyPair) {
    return new Promise((resolve, reject) => {
      const credentials = this.settings.get('credentials')
      plnx.returnTradeHistory({currencyPair, ...credentials}, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  refreshBalances() {
    const credentials = this.settings.get('credentials')
    if (credentials) {
      plnx.returnBalances(credentials, (err, data) => {
        if (err) {
          throw err
        }

        this.balances = this.balances.withMutations((b) => {
          return Object.keys(data).map((key) => {
            return b.set(key, parseFloat(data[key]))
          })
        })

        this.emit('balances', this.balances)
      })
    }
  }

  refreshOrders() {
    const credentials = this.settings.get('credentials')
    if (credentials) {
      plnx.returnOpenOrders({currencyPair: 'all', ...credentials}, (err, data) => {
        if (err) {
          throw err
        }

        this.orders = this.orders.withMutations((orders) => {
          return Object.keys(data).map((currencyPair) => {
            const currencyPairOrders = data[currencyPair].map((order) => {
              return {
                number: order.orderNumber,
                type: order.type,
                rate: parseFloat(order.rate),
                amount: parseFloat(order.amount),
                total: parseFloat(order.total),
                date: Date.parse(order.date)
              }
            })
            return orders.set(currencyPair, Immutable.List(currencyPairOrders))
          })
        })

        this.emit('orders', this.orders)
      })
    }
  }

  getAvailableBalance(currency) {
    return this.balances.get(currency) || 0.0
  }

  getPriceHistory(currencyPair) {
    return this.priceHistory.get(currencyPair) || Immutable.List()
  }

  getChangePercent(currencyPair) {
    const priceHistory = this.getPriceHistory(currencyPair)
    return (priceHistory.last() - priceHistory.first()) * 100
  }

  getStdDeviation(currencyPair) {
    return math.std(...this.getPriceHistory(currencyPair).toArray())
  }


  getOpenOrdersForCurrencyPair(currencyPair) {
    return this.orders.filter((order) => order.currencyPair == currencyPair)
  }

  updatePriceHistory(currencyPair, price) {
    this.priceHistory = this.priceHistory.set(currencyPair, this.getPriceHistory(currencyPair).push(price).slice(-this.windowSize))
    this.emit('priceHistory', this.priceHistory)
  }

  onTicker(currencyPair) {
    this.updatePriceHistory(currencyPair.key, parseFloat(currencyPair.last))
  }
}
