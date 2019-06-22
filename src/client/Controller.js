import Socket from "./Socket";
import { msgType, role } from "../commonStrings";
import "./nui/Login";
import "./nui/Lobby";
import "./nui/MasterView";
import "./nui/SlaveView";
import { RoundEndView } from "./ui/RoundEndView";
import { Notifications } from "./ui/Notifications";
import { Footer } from "./ui/Footer";
import store, { observeStore } from "./store/store";

const views = {};

export class Controller {
  constructor() {
    this.setUpUI();
    this.setUpSocketListeners();
    this._rounds = 0;
  }

  setUpUI() {
    observeStore(state => state.activeView, this.updateView.bind(this));
    // this.notifications = new Notifications();
    // this.footer = new Footer();
    createView("login", "user-login");
    createView("lobby", "user-lobby");
    createView("slave-view");
    createView("master-view");
    createView("round-end");
  }

  setUpSocketListeners() {
     /*
    Socket.on(msgType.winner, data => {
      this.roundEnd.winner = data.player;
      this.roundEnd.winningCard = data.card;
      this.roundEnd.scores = data.scores;
      if (this.role === role.master) this.roundEnd.showNextRoundButton();
    });
    Socket.on(msgType.nextRound, data => {
      this.roundEnd.reset();
      this.newRound();
      this.notifications.publish(`${data.master} wählt aus.`, 10);
    });
    Socket.on(msgType.serverMessage, data =>
      this.notifications.publish(data.msg)
    );
    Socket.on(msgType.close, () => {
      this.view = this.login; 
      if (!this.footer.isAttached())
       document.body.appendChild(this.footer.element);
    }); */
  }

  init() {
    this.view = views.login;
    //document.body.appendChild(this.notifications.element);
    // document.body.appendChild(this.footer.element);
  }

  updateView() {
    const view = store.getState().activeView;
    console.log("update View to", view);
    this.view = views[view || "login"];
  }

  /**
   * @param {UIElement} uiElement
   */
  set view(uiElement) {
    if (this._view)
      document.body.removeChild(
        this._view.element ? this._view.element : this._view
      );
    document.body.appendChild(
      uiElement.element ? uiElement.element : uiElement
    );
    this._view = uiElement;
  }
}

function createView(name, element) {
  views[name] = document.createElement(element ? element : name);
}
