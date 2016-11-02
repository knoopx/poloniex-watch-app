import promisify from 'promisify-node'

const plnx = promisify('plnx')

export default class {
  constructor(credentials) {
    this.credentials = credentials
  }

  async cancelOrder(orderNumber) {
    return plnx.cancelOrder({ orderNumber, ...this.credentials })
  }

  async buy(currencyPair, rate, amount) {
    plnx.buy({ currencyPair, rate, amount, ...this.credentials })
  }

  async sell(currencyPair, rate, amount) {
    plnx.sell({ currencyPair, rate, amount, ...this.credentials })
  }

  async fetchBalances() {
    const data = await plnx.returnCompleteBalances(this.credentials)
    const balances = Object.keys(data).reduce((result, key) => {
      const { available, onOrders, btcValue } = data[key]
      result[key] = {
        available: parseFloat(available),
        onOrders: parseFloat(onOrders),
        btcValue: parseFloat(btcValue)
      }
      return result
    }, {})
    return balances
  }

  async fetchOrders() {
    const data = await plnx.returnOpenOrders({ currencyPair: 'all', ...this.credentials })
    return Object.keys(data).reduce((result, key) => {
      result[key] = data[key].map(({ orderNumber, type, rate, amount, total, date, margin, startingAmount }) => ({
        orderNumber,
        type,
        rate: parseFloat(rate),
        amount: parseFloat(amount),
        total: parseFloat(total),
        date: Date.parse(date),
        margin,
        startingAmount
      }))
      return result
    }, {})
  }

  async fetchTradeHistory(currencyPair, range = (Date.now() / 1000) - 60 * 60 * 24 * 7 * 7) {
    const data = await plnx.returnTradeHistory({ currencyPair: 'all', start: range, ...this.credentials })
    return Object.keys(data).reduce((result, key) => {
      result[key] = data[key].map(({ amount, category, date, fee, orderNumber, rate, total, type, globalTradeID, tradeID }) => ({
        amount: parseFloat(amount),
        category,
        date: Date.parse(date),
        fee: parseFloat(rate),
        orderNumber,
        rate: parseFloat(rate),
        total: parseFloat(total),
        type,
        globalTradeID,
        tradeID
      }))
      return result
    }, {})
  }
}
