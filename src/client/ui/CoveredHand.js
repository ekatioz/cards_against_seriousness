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
      }

      .group:not(.slave):hover {
        background-color: #eeeeee;
        background: radial-gradient(
          ellipse at center,
          rgba(238, 238, 238, 0.5) 0%,
          rgba(238, 238, 238, 0.2) 60%,
          rgba(238, 238, 238, 0) 70%,
          rgba(238, 238, 238, 0) 100%
        );
      }
    `;
  }

  constructor() {
    super();
    observeStore(
      state => state.choosableCards,
      () => {
        this.cards = store.getState().choosableCards;
      }
    );
  }

  onChooseCard(e) {
    if (e.detail.covered) {
      store.dispatch(revealCard(e.detail.card));
    } else {
      store.dispatch(
        chooseCard(
          this.cards.filter(group =>
            group.map(c => c.text).includes(e.detail.card)
          )[0]
        )
      );
    }
  }

  group(cards) {
    if (cards.length === 1) {
      return html`
        ${cards.map(this.toCard.bind(this))}
      `;
    }
    return html`
      <div class="group ${store.getState().role}">
        ${cards.map(this.toCard.bind(this))}
      </div>
    `;
  }

  toCard(card) {
    return html`
      <covered-card
        @choose="${this.onChooseCard}"
        text=${card.text ? card.text : ""}
        covered=${card.covered ? card.covered : ""}
        card=${card}
      ></covered-card>
    `;
  }

  render() {
    return html`
      ${this.cards.map(this.group.bind(this))}
    `;
  }
}

customElements.define("covered-hand", CoveredHand);
