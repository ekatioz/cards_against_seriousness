import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

const gapSeperator = "💣";

class Cloze extends LitElement {
  static get properties() {
    return { cloze: { type: String } };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 18vh;
      }
    `;
  }

  constructor() {
    super();
    observeStore(
      state => state.cloze,
      () => {
        this.cloze = store.getState().cloze;
      }
    );
  }

  render() {
    return html`
      ${this.cloze.replace(/%w/g, gapSeperator)}
    `;
  }
}

customElements.define("cloze-text", Cloze);
