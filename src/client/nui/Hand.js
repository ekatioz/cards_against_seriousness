import "./BasicCard";
import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";
import { confirmCard } from "../store/actions";

export class Hand extends LitElement {
  static get properties() {
    return { cards: [] };
  }

  static get styles() {
    return css`
      :host {
        height: 67%;
      }
    `;
  }

  constructor() {
    super();
    observeStore(
      state => state.whitecards,
      () => {
        this.cards = store.getState().whitecards;
      }
    );
  }

  onChooseCard(e) {
    store.dispatch(confirmCard(e.detail.card));
  }

  render() {
    return html`
      ${this.cards.map(
        card =>
          html`
            <basic-card
              @choose="${this.onChooseCard}"
              text=${card}
            ></basic-card>
          `
      )}
    `;
  }
}

customElements.define("user-hand", Hand);
