import {Emitter} from 'event-kit'
import Immutable from 'immutable'
import plnx from 'plnx'
import rateLimit from 'function-rate-limit'

export default class extends Emitter {
  constructor() {
    super()
    this.throttle = rateLimit(6, 1000, (fn) => fn())
    this.tickers = Immutable.Map()

    plnx.returnTicker({}, (err, data) => {
      Object.keys(data).forEach((key) => {
        const d = data[key]
        const [market, currency] = key.split('_', 2)
        const ticker = {
          key,
          market,
          currency,
          name: `${currency} (${market})`,
          last: parseFloat(d.last),
          lowestAsk: parseFloat(d.lowestAsk),
          highestBid: parseFloat(d.highestBid),
          percentChange: parseFloat(d.percentChange),
          baseVolume: parseFloat(d.baseVolume),
          quoteVolume: parseFloat(d.quoteVolume),
          updatedAt: Date.now(),
        }
        this.tickers = this.tickers.set(key, ticker)
      })

      plnx.push((session) => {
        session.subscribe('ticker', (args) => {
          const [key, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, dailyHigh, dailyLow] = args
          const [market, currency] = key.split('_', 2)

          const ticker = {
            key,
            market,
            currency,
            name: `${currency} (${market})`,
            last: parseFloat(last),
            lowestAsk: parseFloat(lowestAsk),
            highestBid: parseFloat(highestBid),
            percentChange: parseFloat(percentChange),
            baseVolume: parseFloat(baseVolume),
            quoteVolume: parseFloat(quoteVolume),
            dailyHigh: parseFloat(dailyHigh),
            dailyLow: parseFloat(dailyLow),
            updatedAt: Date.now(),
          }

          this.tickers = this.tickers.set(key, ticker)
          this.emit('ticker', ticker)
          this.emit('tickers', this.tickers)
        })
      })
    })
  }

  fetchChartData(currencyPair, period) {
    return new Promise((resolve, reject) => {
      const params = {
        currencyPair,
        start: Math.floor((Date.now() / 1000) - period),
        end: Math.floor(Date.now() / 1000),
        period: 300 // 300, 900, 1800, 7200, 14400, and 86400
      }

      this.throttle(() => {
        plnx.returnChartData(params, (err, data) => {
          if (err) { reject(err) }
          resolve(data)
        })
      })
    })
  }

  getTicker(currencyPair) {
    return this.tickers.get(currencyPair)
  }
}
