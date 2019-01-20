import { Cloze } from "./Cloze";
import { CoveredHand } from "./CoveredHand";
import { FullscreenElement } from "./FullscreenElement";

export class MasterView extends FullscreenElement {

    constructor() {
        super();
        this.addClass('master');
        this._cloze = new Cloze();
        this.addUiElement(this._cloze);
        this._cCards = [];
        this._coveredHand = new CoveredHand(confirmed => this._chooseCallback(confirmed));
        this.addUiElement(this._coveredHand);
    }

    addCoveredCard() {
        this._coveredHand.addCoveredCard();
    }

    unlockCards(cards) {
        this._coveredHand.unlockCards(cards);
    }

    set onCardChoosen(cb) {
        this._chooseCallback = cb;
    }

    set cloze(parts) {
        this._cloze.setTextParts(...parts);
    }
}