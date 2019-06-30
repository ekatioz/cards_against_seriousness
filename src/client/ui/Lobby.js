import { LitElement, html, css } from "lit-element";
import "./PlayersList";
import store from "../store/store";
import { ready } from "../store/actions";
import fullscreen from "../../resources/fullscreen.comp.css";

class Lobby extends LitElement {
  static get properties() {
    return { ready: { type: Boolean, value: false } };
  }

  static get styles() {
    return css([fullscreen]);
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
