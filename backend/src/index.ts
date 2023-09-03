import WebSocket, { Server as WebSocketServer } from "ws";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import {
  getProvider,
  getSigner,
  startGame,
  endGame,
  goCard,
  fillCardDeck,
  settleUpGame,
} from "./moveCall";

dotenv.config();
const server = https.createServer({
  cert: fs.readFileSync(process.env.HTTPS_CERT_PATH!), // 인증서 경로
  key: fs.readFileSync(process.env.HTTPS_KEY_PATH!), // 개인키 경로
});

const provider = getProvider(process.env.RPC_URL!);
const dealer_signer = getSigner(process.env.DEALER_PRIVATE_KEY!, provider);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected.");

  ws.on("error", (error: Error) => {
    console.log(`WebSocket error: ${error}`);
  });

  ws.on("message", (message: WebSocket.Data) => {
    const data = JSON.parse(message as string);
    const flag = data.flag;
    const package_id = data.packageObjectId;
    const game_table_id = data.gameTableObjectId;
    const player_address = data.playerAddress;
    const betting_amount = data.bettingAmount;
    console.log("data: ", data);
    console.log("flag: ", flag);

    if (flag == "Start Game") {
      startGame(dealer_signer, player_address, betting_amount, package_id, game_table_id, ws);
    } else if (flag == "Go Card") {
      goCard(dealer_signer, package_id, game_table_id, player_address, ws);
    } else if (flag == "End Game (Stand)") {
      endGame(dealer_signer, package_id, game_table_id, ws);
    } else if (flag == "Settle Up Game") {
      settleUpGame(dealer_signer, package_id, game_table_id, ws);
    } else if (flag == "Fill Cards") {
      fillCardDeck(dealer_signer, package_id, game_table_id, ws);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

server.listen(8080);
