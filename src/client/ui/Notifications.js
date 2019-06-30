import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

class Notifications extends LitElement {
  static get properties() {
    return { notifications: [] };
  }

  static get styles() {
    return css`
      :host {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #2196f3;
        color: #eee;
        font-size: 0.8em;
        border-top: 0px solid #eee;
        box-shadow: -5px 0 1em #000;
      }
      :host > * {
        transition: all 0.5s;
      }
      .notification {
        display: flex;
        margin: 0.5em;
        text-shadow: 0px 0px 1px #333;
      }
      .timestamp {
        flex: 1;
        flex-grow: 0;
        margin-right: 0.5em;
        font-weight: 100;
        font-variant: all-small-caps;
      }
      .msg {
        flex: 1;
        flex-grow: 1;
      }
    `;
  }

  constructor() {
    super();
    observeStore(
      state => state.notifications,
      () => {
        this.notifications = store.getState().notifications;
      }
    );
  }

  render() {
    return html`
      ${this.notifications
        .filter(({ show }) => show)
        .reverse()
        .slice(0, 3)
        .reverse()
        .map(
          ({ msg, timestamp }) =>
            html`
              <div class="notification">
                <span class="timestamp"
                  >${new Date(timestamp).toLocaleTimeString()}:</span
                >
                <span class="msg">${msg}</span>
              </div>
            `
        )}
    `;
  }
}

customElements.define("cards-notifications", Notifications);
