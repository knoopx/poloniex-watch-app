import {Emitter} from 'event-kit'

export default class extends Emitter {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
    this.emit('item', {key, value})
    this.emit('update')
  }

  get(key, defaultValue = null) {
    const value = localStorage.getItem(key)

    if (value) {
      return JSON.parse(value)
    }

    return defaultValue
  }
}
