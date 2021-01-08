import express from "express";
// import cors from 'cors';
import { createServer } from "http";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { ChatRoom } from "./chat";
import { addCard, deleteCard, getCards } from "./db";
import { Topic } from "./Topic";

const port = Number(process.env.SERVER_PORT || 8080);
const app = express();
app.use(express.json());
app.use(express.text());

const gameServer = new Server({
  server: createServer(app),
  express: app,
  pingInterval: 0,
});

gameServer.define("chat", ChatRoom)
  .enableRealtimeListing();

app.use("/colyseus", monitor());

gameServer.listen(port).then(() => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/blackcards", (req, res) => {
  getCards(Topic.BLACKCARD).then((cards) => {
    res.send(JSON.stringify(cards));
  });
});

app.get("/whitecards", (req, res) => {
  getCards(Topic.WHITECARD).then((cards) => {
    res.send(JSON.stringify(cards));
  });
});

app.post("/blackcard", (req, res) => {
  const card: string = req.body;
  if (card && card.includes("%w")) {
    addCard(Topic.BLACKCARD, card).then(() => res.send("ok"));
  } else {
    res.sendStatus(400);
  }
});

app.post("/whitecard", (req, res) => {
  const card: string = req.body;
  if (card) {
    addCard(Topic.WHITECARD, card).then(() => res.send("ok"));
  } else {
    res.sendStatus(400);
  }
});

app.delete("/blackcard", (req, res) => {
  const id: string = req.body;
  if (id) {
    deleteCard(Topic.BLACKCARD, id).then(() => res.send("ok"));
  } else {
    res.sendStatus(400);
  }
});

app.delete("/whitecard", (req, res) => {
  const id: string = req.body;
  if (id) {
    deleteCard(Topic.WHITECARD, id).then(() => res.send("ok"));
  } else {
    res.sendStatus(400);
  }
});
