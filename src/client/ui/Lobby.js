import { FullscreenElement } from "./FullscreenElement";
import { PlayersList } from "./PlayersList";
import { ProceedButton } from "./ProceedButton";

export class Lobby extends FullscreenElement {

    constructor(readyCallback) {
        super();
        this.addClass('login');
        this._players = new PlayersList();
        this.addUiElement(this._players);
        this.addUiElement(new ProceedButton('Bereit', () => readyCallback()));
    }

    set players(players){
        this._players.update(players);
    }
}