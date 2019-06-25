import produce from "immer";
import Socket from "../Socket";
import { msgType } from "../../commonStrings";
import initialState from "./initialState.json";

const reduce = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case msgType.updateUsername:
        draft.username = action.username;
        break;
      case msgType.newPlayer:
        Socket.send({ type: action.type, name: state.username });
        document.title = `${state.username} - ${document.title}`;
        draft.activeView = "user-lobby";
        break;
      case msgType.ready:
        Socket.send({ type: action.type });
        break;
      case msgType.userlist:
        draft.players = action.data.users;
        break;
      case msgType.role:
        draft.role = action.data.role;
        break;
      case msgType.blackcard:
        draft.cloze = action.data.response;
        break;
      case msgType.whitecard:
        draft.whitecards.push(...action.data.response);
        break;
      case msgType.nextRound:
        draft.round++;
        draft.roundMaster = action.data.master;
        draft.activeView = `${state.role}-view`;
        draft.winner = undefined;
        draft.winningCard = undefined;
        draft.confirmedCards = [];

        break;
      case msgType.chooseCard:
        Socket.send({ type: action.type, card: action.card });
        draft.activeView = "round-end";
        break;
      case msgType.confirmCard:
        draft.whitecards = state.whitecards.filter(
          card => card !== action.card
        );
        Socket.send({ type: action.type, text: action.card });
        draft.activeView = "round-end";
        break;
      case msgType.revealCard:
        const found = draft.confirmedCards.filter(
          card => card.text === action.card
        )[0];
        found.covered = false;
        break;
      case msgType.finishRound:
        Socket.send({ type: msgType.nextRound });
        break;
      case msgType.cardConfirmed:
        draft.confirmedCards.push({
          covered: true
        });
        break;
      case msgType.reveal:
        action.data.cards.forEach((card, index) => {
          draft.confirmedCards[index].text = card;
        });
        break;
      case msgType.close:
        draft.activeView = "user-login";
        break;
      case msgType.winner:
        draft.winner = action.data.player;
        draft.winningCard = action.data.card;
        draft.scores = action.data.scores;
        break;
      case msgType.serverMessage:
        draft.notifications.push(action.data.msg);
        break;
      default:
        break;
    }
  });
};

export default reduce;
