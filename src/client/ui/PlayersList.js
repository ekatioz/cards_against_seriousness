import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

class PlayersList extends LitElement {
  static get properties() {
    return { players: [] };
  }

  constructor() {
    super();
    observeStore(
      state => state.players,
      () => {
        this.players = store.getState().players;
      }
    );
  }

  render() {
    return html`
      ${this.players.map(playerToString)}
    `;
  }
}

function playerToString(player) {
  return html`
    <div class="lobby-entry ${player.ready ? "ready" : ""}">
      ${player.name + (player.ready ? "👓" : "")}
    </div>
  `;
}

customElements.define("players-list", PlayersList);
