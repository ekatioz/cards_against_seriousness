import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

export class Winner extends LitElement {
  static get properties() {
    return { winner: { type: String } };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
    observeStore(
      state => state.winner,
      () => {
        this.winner = store.getState().winner;
      }
    );
  }

  render() {
    return html`
      ${this.winner ? this.winner + " gewinnt diese Runde!" : ""}
    `;
  }
}

customElements.define("winner-player", Winner);
