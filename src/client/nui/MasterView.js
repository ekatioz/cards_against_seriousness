import "./Cloze";
import { LitElement, html, css } from "lit-element";

class MasterView extends LitElement {
  static get properties() {
    return { coveredCards: [] };
  }

  static get styles() {
    return css`
      :host {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        padding: 1em;
      }
    `;
  }

  render() {
    return html`
      <cloze-text></cloze-text>
    `;
  }

  /*   constructor() {
    super();
    this.addClass("master");

    this._cCards = [];
    this._coveredHand = new CoveredHand(confirmed =>
      this._chooseCallback(confirmed)
    );
    this.addUiElement(this._coveredHand);
  } */

  addCoveredCard() {
    this._coveredHand.addCoveredCard();
  }

  unlockCards(cards) {
    this._coveredHand.unlockCards(cards);
  }

  set onCardChoosen(cb) {
    this._chooseCallback = cb;
  }

  set cloze(parts) {
    this._cloze.setTextParts(...parts);
  }
}

customElements.define("master-view", MasterView);
