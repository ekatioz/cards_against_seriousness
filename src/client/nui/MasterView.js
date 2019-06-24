import "./Cloze";
import "./CoveredHand";
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
      <covered-hand></covered-hand>
    `;
  }
}

customElements.define("master-view", MasterView);
