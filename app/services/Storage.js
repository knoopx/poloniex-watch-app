export default new class {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  get(key, defaultValue = null) {
    const value = localStorage.getItem(key)

    if (value) {
      return JSON.parse(value)
    }

    return defaultValue
  }
}
