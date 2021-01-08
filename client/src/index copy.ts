import * as Colyseus from "colyseus.js";

const headline: HTMLElement = document.querySelector("#main");

fetch("/api/test").then((r) => r.text()).then((text) => headline.innerText = text);

console.log("test");

const host = window.document.location.host.replace(/:.*/, "");

const client = new Colyseus.Client(`${window.location.protocol.replace("http", "ws")}//${host}${location.port ? `:${location.port}` : ""}/socket`);
client.joinOrCreate("chat").then((room) => {
  console.log("joined");
  room.onStateChange.once((state) => {
    console.log("initial room state:", state);
  });

  // new room state
  room.onStateChange((state) => {
    // this signal is triggered on each patch
  });

  // listen to patches coming from the server
  room.onMessage("messages", (message) => {
    const p = document.createElement("p");
    p.innerText = message;
    document.querySelector("#messages").appendChild(p);
  });

  // send message to room on submit
  (document.querySelector("#form") as HTMLFormElement).onsubmit = function (e) {
    e.preventDefault();

    const input: HTMLInputElement = document.querySelector("#input");

    console.log("input:", input.value);

    // send data to room
    room.send("message", input.value);

    // clear input
    input.value = "";
  };
});
