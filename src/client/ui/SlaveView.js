import { Cloze } from "./Cloze";
import { FullscreenElement } from "./FullscreenElement";
import { Hand } from "./Hand";

export class SlaveView extends FullscreenElement {

    constructor() {
        super();
        this.addClass('slave');
        this._cloze = new Cloze();
        this._hand = new Hand(confirmed => {
            this._hand.removeCard(confirmed);
            this._confirmedCallback(confirmed.text);
        });
        this.addUiElement(this._cloze);
        this.addUiElement(this._hand);
    }

    set onCardConfirmed(cb){
        this._confirmedCallback = cb;
    }

    set cloze(parts){
        this._cloze.setTextParts(...parts);
    }

    addWhitecards(cards){
        cards.forEach(card => {
            this._hand.addCard(card);
        });
    }
}