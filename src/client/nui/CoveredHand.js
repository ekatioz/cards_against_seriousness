import "./CoveredCard";
import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";
import { chooseCard, revealCard } from "../store/actions";

export class CoveredHand extends LitElement {
  static get properties() {
    return {
      cards: {
        type: Array,
        value: []
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        text-align: center;
        height: 80vh;
      }
    `;
  }

  constructor() {
    super();
    observeStore(
      state => state.confirmedCards,
      () => {
        this.cards = store.getState().confirmedCards;
      }
    );
  }

  onChooseCard(e) {
    if (e.detail.covered) {
      store.dispatch(revealCard(e.detail.card));
    } else {
      store.dispatch(chooseCard(e.detail.card));
    }
  }

  render() {
    return html`
      ${this.cards.map(
      card =>
        html`
            <covered-card
              @choose="${this.onChooseCard}"
              text=${card.text ? card.text : ""}
              covered=${card.covered ? card.covered : ""}
              card=${card}
            ></covered-card>
          `
    )}
    `;
  }
}

customElements.define("covered-hand", CoveredHand);
