import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

const gapSeperator = "💣";

class Cloze extends LitElement {
  static get properties() {
    return { cloze: { type: String } };
  }

  static get styles() {
    return css`
      .cloze {
        height: 33%;
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
      <div class="cloze">${this.cloze.replace(/%w/g, gapSeperator)}</div>
    `;
  }
}

customElements.define("cloze-text", Cloze);
