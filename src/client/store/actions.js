import { msgType } from "../../commonStrings";

export const updateUsername = username => ({
  type: msgType.updateUsername,
  username
});

export const login = () => ({
  type: msgType.newPlayer
});

export const ready = () => ({
  type: msgType.ready
});

export const socketAction = data => ({
  type: data.type,
  data
});

export const chooseCard = card => ({
  type: msgType.chooseCard,
  card
});

export const revealCard = card => ({
  type: msgType.revealCard,
  card
});

export const confirmCard = card => ({
  type: msgType.confirmCard,
  card
});

export const finishRound = card => ({
  type: msgType.finishRound
});
