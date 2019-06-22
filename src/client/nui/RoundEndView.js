import { Cloze } from "./Cloze";
import { FullscreenElement } from "./FullscreenElement";
import { ProceedButton } from "./ProceedButton";
import { Scoreboard } from "./Scoreboard";

export class RoundEndView extends FullscreenElement {

    constructor() {
        super();
        this.addClass('roundEnd');
        this._cloze = new Cloze();
        this.addUiElement(this._cloze);

        this._winner = document.createElement('div');
        this._winner.className = 'winner';
        this.addDomElement(this._winner);

        this._winningCard = document.createElement('div');
        this._winningCard.className = 'winningCard';
        this.addDomElement(this._winningCard);

        this._scores = new Scoreboard();
        this.addUiElement(this._scores);

        this._nextRound = new ProceedButton('Nächste Runde', () => this._nextRoundCallback());
    }

    reset(){
        this._winner.innerText = '';
        this._winningCard.innerText = '';
        this.removeUiElement(this._nextRound);
        this._cloze.clear();
    }

    showNextRoundButton() {
        this.addUiElement(this._nextRound);
    }

    set winner(winner) {
        this._winner.innerText = `${winner} gewinnt diese Runde!`;
    }
    
    set winningCard(card){
        this._winningCard.innerText = card;
    }

    set scores(scores){
        this._scores.scores = scores;
    }

    set onNextRound(cb) {
        this._nextRoundCallback = cb;
    }

    set cloze(parts) {
        this._cloze.setTextParts(...parts);
    }
}