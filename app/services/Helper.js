export function numberColor(number) {
  if (number > 0) { return 'green' }
  if (number < 0) { return 'red' }
  return 'inherit'
}

export function trendSymbol(diff) {
  if (diff > 0) { return '▲' }
  if (diff < 0) { return '▼' }
  return '►'
}

export function numberToPercentage(number, precision = 2) {
  return (number > 0 ? '+' : '') + number.toFixed(precision) + '%'
}

export function numberToDelimited(number, precision = 8) {
  const [left, right] = number.toFixed(precision).split('.', 2)
  return left.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (right ? '.' + right : '')
}

export function numberToCurrency(number, quote = '', precision = 8) {
  return (quote + ' ' + numberToDelimited(number, precision)).trim()
}

export function changePercent(first, last) {
  return (last - first) / first * 100
}
