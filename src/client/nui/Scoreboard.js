import { UiElement } from "./UiElement";

export class Scoreboard extends UiElement {

    constructor() {
        super();
        this.addClass('scoreboard');
    }

    set scores(scores) {
        this.clear();
        scores.sort((a, b) => b.score - a.score);
        scores.forEach(elm => {
            const row = document.createElement('div');
            const player = document.createElement('div');
            const score = document.createElement('div');

            row.className = 'scoreRow';
            player.className = 'player';
            score.className = 'score';

            player.innerText = elm.name;
            score.innerText = elm.score;

            row.appendChild(player);
            row.appendChild(score);
            this.addDomElement(row);
        });
    }
}