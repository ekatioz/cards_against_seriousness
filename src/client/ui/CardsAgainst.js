import { LitElement, html } from "lit-element";
import store, { observeStore } from "../store/store";
import "reset-css";
import "../../resources/styles.css";
import "./Login";
import "./Lobby";
import "./MasterView";
import "./SpectatorView";
import "./SlaveView";
import "./RoundEndView";
import "./Notifications";
import { showNotification } from "../store/actions";

class CardsAgains extends LitElement {
  static get properties() {
    return { view: { type: String } };
  }

  constructor() {
    super();
    observeStore(
      state => state.activeView,
      () => {
        this.view = store.getState().activeView;
      }
    );
  }

  getView() {
    const elm = document.createElement(this.view).outerHTML;
    return html([elm]);
  }

  render() {
    console.log("render", this.view);
    return html`
      ${this.getView()}
      <cards-notifications></cards-notifications>
    `;
  }
}

customElements.define("cards-against-seriousness", CardsAgains);

observeStore(
  state => state.roundMaster,
  () => {
    if (store.getState().roundMaster) {
      store.dispatch(
        showNotification(`${store.getState().roundMaster} wählt aus!`)
      );
    }
  }
);
