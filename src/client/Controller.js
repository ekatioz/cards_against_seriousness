
import Socket from "./Socket";
import { msgType, role } from "../commonStrings";
import { Login } from "./ui/Login";
import { Lobby } from "./ui/Lobby";
import { MasterView } from "./ui/MasterView";
import { SlaveView } from "./ui/SlaveView";
import { RoundEndView } from "./ui/RoundEndView";
import { Notifications } from "./ui/Notifications";
import { Footer } from "./ui/Footer";

export class Controller {

    constructor() {
        this.setUpUI();
        this.setUpSocketListeners();
        this._rounds = 0;
    }

    setUpUI() {
        this.notifications = new Notifications();
        this.footer = new Footer();
        this.lobby = new Lobby(() => Socket.send({ type: msgType.ready }));
        this.login = new Login(username => {
            Socket.send({ type: msgType.newPlayer, name: username });
            document.title = `${username} - ${document.title}`;
            this.view = this.lobby;
        });
        this.master = new MasterView();
        this.slave = new SlaveView();
        this.roundEnd = new RoundEndView();
        this.master.onCardChoosen = card => {
            Socket.send({ type: msgType.chooseCard, card: card });
            this.view = this.roundEnd;
        };
        this.slave.onCardConfirmed = card => {
            Socket.send({ type: msgType.confirmCard, text: card });
            this.view = this.roundEnd;
        };
        this.roundEnd.onNextRound = () => Socket.send({ type: msgType.nextRound });
    }

    setUpSocketListeners() {
        Socket.on(msgType.userlist, data => this.lobby.players = data.users);
        Socket.on(msgType.role, data => this.role = data.role);
        Socket.on(msgType.blackcard, data => {
            this.master.cloze = data.response;
            this.slave.cloze = data.response;
            this.roundEnd.cloze = data.response;
        });
        Socket.on(msgType.whitecard, data => this.slave.addWhitecards(data.response));
        Socket.on(msgType.cardConfirmed, () => this.master.addCoveredCard());
        Socket.on(msgType.reveal, data => this.master.unlockCards(data.cards));
        Socket.on(msgType.winner, data => {
            this.roundEnd.winner = data.player;
            this.roundEnd.winningCard = data.card;
            this.roundEnd.scores = data.scores;
            if (this.role === role.master)
                this.roundEnd.showNextRoundButton();
        });
        Socket.on(msgType.nextRound, data => {
            this.roundEnd.reset();
            this.newRound();
            this.notifications.publish(`${data.master} wählt aus.`,10);
        });
        Socket.on(msgType.serverMessage, data => this.notifications.publish(data.msg));
        Socket.on(msgType.close, () => {
            this.view = this.login;
            if(!this.footer.isAttached()) document.body.appendChild(this.footer.element);
        });
    }

    newRound() {
        if(this.footer.isAttached()) document.body.removeChild(this.footer.element);
        this._rounds++;
        if (this.role === role.master) {
            this.view = this.master;
        }
        else {
            this.view = this.slave;
        }
    }

    init() {
        this.view = this.login;
        this.login.username.focus();
        document.body.appendChild(this.notifications.element);
        document.body.appendChild(this.footer.element);
    }

    /**
     * @param {UIElement} uiElement
     */
    set view(uiElement) {
        if (this._view) document.body.removeChild(this._view.element);
        document.body.appendChild(uiElement.element);
        this._view = uiElement;
    }
}
