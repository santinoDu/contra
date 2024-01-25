

export class Trait {
  constructor() {
    this.listeners = [];
  }

  listen(name, callback) {
    this.listeners.push({
      name,
      callback,
      count: 1
    })
  }

  finalize(entity) {
    this.listeners = this.listeners.filter(listener => {
      
    })
  }
}