import { msgType } from "../../commonStrings";
import { hashString } from "../utils";
import store from "./store";

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

export const showNotification = (msg, duration = 3) => {
  const timestamp = new Date();
  const hash = hashString(msg + timestamp.getTime());
  setTimeout(() => {
    store.dispatch(removeNotification(hash, msg));
  }, duration * 1000);
  return {
    type: msgType.showNotification,
    msg,
    hash,
    timestamp
  };
};

export const removeNotification = (hash, msg) => ({
  type: msgType.removeNotification,
  hash,
  msg
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
