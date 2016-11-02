import rateLimit from 'promise-rate-limit'
import promisify from 'promisify-node'
const plnx = promisify('plnx')

function typeCastTickerListItem({ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, dailyHigh, dailyLow }) {
  const [base, quote] = currencyPair.split('_', 2)
  return {
    currencyPair,
    base,
    quote,
    name: `${quote} (${base})`,
    last: parseFloat(last),
    lowestAsk: parseFloat(lowestAsk),
    highestBid: parseFloat(highestBid),
    percentChange: parseFloat(percentChange),
    baseVolume: parseFloat(baseVolume),
    isFrozen,
    quoteVolume: parseFloat(quoteVolume),
    dailyHigh: parseFloat(dailyHigh),
    dailyLow: parseFloat(dailyLow),
    updatedAt: Date.now()
  }
}

export default new class {
  constructor() {
    this.throttle = rateLimit(6, 1000, fn => fn())
  }

  async fetchTickers() {
    return this.throttle(() => (
      plnx.returnTicker({}).then(data => (
        Object.keys(data).reduce((tickers, currencyPair) => {
          tickers[currencyPair] = typeCastTickerListItem({ currencyPair, ...data[currencyPair] })
          return tickers
        }, {})
      ))
    ))
  }

  async fetchChartData(currencyPair, interval, period = 300) {
    const params = {
      currencyPair,
      start: Math.floor((Date.now() / 1000) - interval),
      end: Math.floor(Date.now() / 1000),
      period // 300, 900, 1800, 7200, 14400, and 86400
    }

    return this.throttle(() => (
      plnx.returnChartData(params).then(data => (
        data.map((d) => {
          d.date = new Date(d.date * 1000)
          return d
        })
      ))
    ))
  }

  subscribe(fn) {
    plnx.push((session) => {
      session.subscribe('ticker', ([currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, dailyHigh, dailyLow]) => {
        fn(typeCastTickerListItem({ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, dailyHigh, dailyLow }))
      })
    })
  }
}()
