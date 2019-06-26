import produce from "immer";
import Socket from "../Socket";
import { msgType } from "../../commonStrings";
// import initialState from "./initialState.dev.json";
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
        console.log("action.card", action.card);
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
          draft.activeView = "round-end";
        }
        break;
      case msgType.revealCard:
        const found = draft.choosableCards
          .flat()
          .filter(card => card.text === action.card)[0];
        found.covered = false;
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
