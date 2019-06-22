import { LitElement, html, css } from "lit-element";
import "./PlayersList";
import store from "../store/store";
import { ready } from "../store/actions";

class Lobby extends LitElement {
  static get properties() {
    return { ready: { type: Boolean, value: false } };
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

  onReady(e) {
    this.ready = true;
    store.dispatch(ready());
  }

  render() {
    return html`
      <players-list></players-list>
      ${this.ready
        ? ""
        : html`
            <proceed-button
              action="Bereit"
              @proceed="${this.onReady}"
            ></proceed-button>
          `}
    `;
  }
}

customElements.define("user-lobby", Lobby);
