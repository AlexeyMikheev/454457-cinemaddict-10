import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  constructor(container) {
    super();
    this._container = container;
  }

  initComponents() {
    throw new Error(`Abstract method not implemented: initComponents`);
  }

  rerender() {
    // this.removeElement();
    // this._container.appendChild(this.getElement());
    this.initComponents();
    this.recoveryListeners();
  }

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }
}
