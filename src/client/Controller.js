
import Socket from "./Socket";
import { msgType, role } from "../commonStrings";
import { Login } from "./ui/Login";
import { Lobby } from "./ui/Lobby";
import { MasterView } from "./ui/MasterView";
import { SlaveView } from "./ui/SlaveView";

export class Controller {
    constructor() {
        this.lobby = new Lobby(() => Socket.send({ type: msgType.ready }));
        this.login = new Login(username => {
            Socket.send({ type: msgType.newPlayer, name: username });
            this.view = this.lobby;
        });
        this.master = new MasterView();
        this.slave = new SlaveView();

        Socket.on(msgType.userlist, data => this.lobby.players = data.users);
        Socket.on(msgType.role, data => this.role = data.role);
        Socket.on(msgType.startGame, () => this.startGame());
        Socket.on(msgType.blackcard, data => {
            this.master.cloze = data.response;
            this.slave.cloze = data.response;
        });
        Socket.on(msgType.whitecard, data => this.slave.addWhitecards(data.response));
        Socket.on(msgType.cardConfirmed, () => this.master.addCoveredCard());
        Socket.on(msgType.reveal, data => this.master.unlockCards(data.cards));
        Socket.on(msgType.winner, data => alert(`${data.player} hat gewonnen mit: ${data.card}`));


        Socket.on('nextRound', () => nextRound());
        Socket.on('lock', () => lockUI());
        

    }

    startGame() {
        if (this.role === role.master) {
            this.view = this.master;
            this.master.onCardChoosen = card => Socket.send({type:msgType.chooseCard, card:card});
        } else {
            this.view = this.slave;
            this.slave.onCardConfirmed = card => Socket.send({type:msgType.confirmCard, text:card});
        }
    }

    init() {
        this.view = this.login;
    }

    set view(uiElement) {
        if (this._view) document.body.removeChild(this._view.element);
        document.body.appendChild(uiElement.element);
        this._view = uiElement;
    }
}
