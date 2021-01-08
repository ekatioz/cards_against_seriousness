import { Client, Room } from "colyseus.js";
import Cookies from "js-cookie";
import { ChooseCardsPage } from "./pages/choose-cards/choose-cards";

import { LobbyPage } from "./pages/lobby/lobby";
import { LoginPage } from "./pages/login/login";
import { PlayCardsPage } from "./pages/play-cards/play-cards";
import { ReadyRoomPage } from "./pages/ready-room/ready-room";
import { State } from "./schema/State";
import { WhiteCard } from "./schema/WhiteCard";

const main = document.querySelector("#main");
const name = Cookies.get("name");
if (!name) {
  const login = document.createElement(LoginPage.tagName as string);
  main.appendChild(login);
  login.addEventListener("login-success", showLobby);
} else {
  showLobby();
}

function showLobby() {
  main.innerHTML = "";
  const host = window.location.host.replace(/:.*/, "");
  const port = window.location.port ? `:${window.location.port}` : "";
  window.client = new Client(
    `${window.location.protocol.replace("http", "ws")}//${host}${port}/socket`,
  );
  const lobby = document.createElement(LobbyPage.tagName as string);
  main.appendChild(lobby);
  lobby.addEventListener("start-game", (event: CustomEvent) => {
    const game: Room = event.detail;
    game.send("name", Cookies.get("name"));
    game.onLeave(showLobby);
    showReadyRoom(game);
  });
}

function showReadyRoom(game: Room<State>) {
  main.innerHTML = "";
  const readyRoom = document.createElement(ReadyRoomPage.tagName as string) as ReadyRoomPage;
  readyRoom.game = game;
  main.appendChild(readyRoom);
  readyRoom.addEventListener("start-game", () => {
    game.send("start");
  });
  game.state.listen("chooser", (chooser) => {
    console.log("chooser:", chooser.name);
    if (chooser.id === game.sessionId) {
      showChooseCards(game);
    } else {
      showPlayCards(game);
    }
  });
}

function showChooseCards(game: Room) {
  main.innerHTML = "";
  const chooseCards = document.createElement(ChooseCardsPage.tagName as string) as ChooseCardsPage;
  chooseCards.game = game;
  main.appendChild(chooseCards);
}

function showPlayCards(game: Room) {
  main.innerHTML = "";
  const playCards = document.createElement(PlayCardsPage.tagName as string) as PlayCardsPage;
  playCards.game = game;
  main.appendChild(playCards);
}
