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
        draft.activeView = "lobby";
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
        draft.activeView = `${state.role}-view`;
        break;
      case msgType.chooseCard:
        Socket.send({ type: action.type, card: action.card });
        draft.activeView = "round-end";
        break;
      case msgType.confirmCard:
        Socket.send({ type: action.type, text: action.card });
        draft.activeView = "round-end";
        break;
      case msgType.finishRound:
        Socket.send({ type: msgType.nextRound });
        break;
      case msgType.cardConfirmed:
        draft.confirmedCards.push({ revealed: false });
        break;
      case msgType.reveal:
        action.data.cards.forEach((card, index) => {
          draft.confirmedCards[index].revealed = true;
          draft.confirmedCards[index].text = card;
        });
        break;
      default:
        break;
    }
  });
};

export default reduce;
