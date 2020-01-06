export default class Store {
  constructor(key, storage) {
    this._storeKey = key;
    this._storage = storage;
  }

  getData() {
    try {
      const store = this._storage.getItem(this._storeKey);
      if (store) {
        return JSON.parse(this._storage.getItem(this._storeKey));
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getData();
    const newValue = {};
    Object.assign(newValue, store, {[key]: value});

    this._storage.setItem(this._storeKey, JSON.stringify(newValue));
  }

  removeItem(key) {
    const store = this.getData();
    delete store[key];
    this._storage.setItem(this._storeKey, JSON.stringify(store));
  }
}
