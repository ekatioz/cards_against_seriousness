import { Cloze } from "./Cloze";
import { FullscreenElement } from "./FullscreenElement";
import { ProceedButton } from "./ProceedButton";

export class RoundEndView extends FullscreenElement {

    constructor() {
        super();
        this.addClass('roundEnd');
        this._cloze = new Cloze();
        this.addUiElement(this._cloze);

        this._winner = document.createElement('div');
        this._winner.className = 'winner';

        this._winningCard = document.createElement('div');
        this._winningCard.className = 'winningCard';

        this._nextRound = new ProceedButton('Nächste Runde', () => this._nextRoundCallback());
    }

    showNextRoundButton() {
        this.addUiElement(this._nextRound);
    }

    setWinner(winner, card) {
        this._winner.innerText = `${winner} gewinnt diese Runde!`;
        this.addDomElement(this._winner);

        this._winningCard.innerText = card;
        this.addDomElement(this._winningCard);
    }

    set onNextRound(cb) {
        this._nextRoundCallback = cb;
    }

    set cloze(parts) {
        this._cloze.setTextParts(...parts);
    }

    clear() {
        this.removeDomElement(this._winner);
        this.removeDomElement(this._winningCard);
        if (this._nextRound.isAttached()) this.removeUiElement(this._nextRound);
        this._cloze.clear();
    }
}