import { UiElement } from "./UiElement";

export class PlayersList extends UiElement{

    constructor() {
        super();
        this.addClass('lobby-list');
    }

    update(players){
        this.clear();
        players.forEach(player => {
            const entry = document.createElement('div');
            entry.className = `lobby-entry ${player.ready? 'ready' : ''}`;
            entry.innerText = player.name + (player.ready? '👓' : '');
            this.addDomElement(entry);
        });
    }
}