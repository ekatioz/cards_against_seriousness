import "./Cloze";
import "./Hand";
import { LitElement, html, css } from "lit-element";

export class SlaveView extends LitElement {
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
      <user-hand></user-hand>
    `;
  }
}

customElements.define("slave-view", SlaveView);
