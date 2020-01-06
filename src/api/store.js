import Film from "../models/film";

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

  getDataById(id) {
    const store = this.getData();
    if (store) {
      const item = Object.values(store).map((storeItem) => storeItem.data).find((dataItem) => {
        return dataItem.id === id;
      });
      return Film.parseFilm(item);
    }
    return null;
  }

  setItem(key, value) {
    const store = this.getData();
    const newValue = {};
    Object.assign(newValue, store, {[key]: value});

    this._storage.setItem(this._storeKey, JSON.stringify(newValue));
  }
}
