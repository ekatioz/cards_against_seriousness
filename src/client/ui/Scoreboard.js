import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

export class Scoreboard extends LitElement {
  static get properties() {
    return { scores: [] };
  }
  static get styles() {
    return css`
      :host {
        margin-top: 1em;
        display: table;
      }
      .scoreRow {
        display: table-row;
      }

      .player {
        display: table-cell;
      }

      .score {
        display: table-cell;
        padding-left: 1em;
      }
    `;
  }

  constructor() {
    super();
    observeStore(
      state => state.scores,
      () => {
        this.scores = store.getState().scores;
      }
    );
  }

  render() {
    return html`
      ${this.scores
        .map(x => x)
        .sort((a, b) => b.score - a.score)
        .map(scoreToRow)}
    `;
  }
}

function scoreToRow(score) {
  return html`
    <div class="scoreRow">
      <div class="player">${score.name}</div>
      <div class="score">${score.score}</div>
    </div>
  `;
}

customElements.define("score-board", Scoreboard);
