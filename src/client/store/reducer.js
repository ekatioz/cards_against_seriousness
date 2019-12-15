import produce from "immer";
import Socket from "../Socket";
import { msgType, role } from "../../commonStrings";
import initialState from "./initialState.json";
//import initialState from "./initialState.dev.json";

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
        draft.desiredWhitecards = 0;
        var regex = /%w/gi,
          result;
        while ((result = regex.exec(action.data.response))) {
          draft.desiredWhitecards++;
        }
        break;
      case msgType.whitecard:
        draft.whitecards.push(...action.data.response);
        break;
      case msgType.nextRound:
        draft.round++;
        draft.roundMaster = action.data.master;
        draft.activeView = `${state.role}-view`;
        draft.winner = undefined;
        draft.winningCards = initialState.winningCards;
        draft.confirmedCards = initialState.confirmedCards;
        draft.choosableCards = initialState.choosableCards;
        break;
      case msgType.chooseCard:
        Socket.send({ type: action.type, cards: action.card.map(c => c.text) });
        draft.activeView = "round-end";
        break;
      case msgType.confirmCard:
        draft.whitecards = state.whitecards.filter(
          card => card !== action.card
        );
        draft.confirmedCards.push(action.card);
        if (draft.confirmedCards.length === state.desiredWhitecards) {
          Socket.send({ type: action.type, cards: draft.confirmedCards });
          draft.activeView = "spectator-view";
        }
        break;
      case msgType.revealCard:
        const found = draft.choosableCards
          .flat()
          .find(
            card =>
              card.text ===
              (draft.role === role.master ? action.card : action.data.card)
          );
        found.covered = false;
        if (draft.role === role.master) {
          Socket.send({ type: action.type, card: action.card });
        }
        break;
      case msgType.finishRound:
        Socket.send({ type: msgType.nextRound });
        break;
      case msgType.cardConfirmed:
        const covered = [];
        for (let index = 0; index < state.desiredWhitecards; index++) {
          covered.push({
            covered: true
          });
        }
        draft.choosableCards.push(covered);
        break;
      case msgType.reveal:
        action.data.cards.forEach((group, groupIndex) =>
          group.forEach(
            (card, cardIndex) =>
              (draft.choosableCards[groupIndex][cardIndex].text = card)
          )
        );
        break;
      case msgType.close:
        draft.activeView = "user-login";
        break;
      case msgType.winner:
        draft.winner = action.data.player;
        draft.winningCards = action.data.cards;
        draft.scores = action.data.scores;
        draft.activeView = "round-end";
        break;
      case msgType.showNotification:
        draft.notifications.push({
          timestamp: action.timestamp,
          show: true,
          msg: action.msg,
          hash: action.hash
        });
        break;
      case msgType.removeNotification:
        const hide = draft.notifications.filter(
          ntfctn => ntfctn.hash === action.hash
        )[0];
        hide.show = false;
        break;
      default:
        break;
    }
  });
};

export default reduce;
