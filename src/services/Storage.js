export default class Storage {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static get(key, defaultValue = null) {
    const value = localStorage.getItem(key)

    if (value) {
      return JSON.parse(value)
    }

    return defaultValue
  }
}
