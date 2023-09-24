import WebSocket, { Server as WebSocketServer } from "ws";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import {
  getKeypair,
  startGame,
  endGame,
  goCard,
  fillCardDeck,
  settleUpGame, ITxResponse,
} from "./moveCall";

dotenv.config();

const dealer_signer = getKeypair(process.env.DEALER_PRIVATE_KEY!);

const wss = new WebSocketServer({ port: 8080 });
const clients: Set<WebSocket> = new Set();

interface ITxArgs {
    player_address: string;
    betting_amount: string;
    package_id: string;
    game_table_id: string;
}

interface ITxData {
    flag: string;
    args: ITxArgs;
    ws: WebSocket;
}

const txQueue: ITxData[] = [];
let isProcessing = false;

async function processNextTx() {
  const op = "processNextTx"

  if (txQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const txData = txQueue.shift()!;

  try {
    const result = await processTx(txData);
    if (result === null) {
      // TODO websocket은 에러 처리를 어떻게 해야하지?
      console.error(op + ': Error processing failed - result is null!');
      clients.forEach(function each(client) {
        if(client === txData.ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ error: "Error processing failed - result is null!" }));
        }
      });
    } else {
      console.log('Tx processed successfully: ', result.flag);
      clients.forEach(function each(client) {
        if(client === txData.ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(result));
        }
      });
    }
  } catch(e) {
    console.error(op + ': Error processing failed: ', e);
  }

  processNextTx();
}

async function processTx(txData: ITxData): Promise<ITxResponse | null> {
    const op = "processTx"

  // 트랜잭션 처리 로직 구현
    const { flag, args } = txData;
    const { player_address, betting_amount, package_id, game_table_id } = args;

    try {
      let result:ITxResponse = {} as ITxResponse;

      if (flag == "Start Game") {
        result = await startGame(dealer_signer, player_address, betting_amount, package_id, game_table_id);
      } else if (flag == "Go Card") {
        result = await goCard(dealer_signer, package_id, game_table_id, player_address);
      } else if (flag == "End Game (Stand)") {
        result = await endGame(dealer_signer, package_id, game_table_id);
      } else if (flag == "Settle Up Game") {
        result = await settleUpGame(dealer_signer, package_id, game_table_id);
      } else if (flag == "Fill Cards") {
        result = await fillCardDeck(dealer_signer, package_id, game_table_id);
      }

      return result;
    }  catch (e) {
      console.error(op + ': Error processing transaction: ', e);
      return null;
    }

}

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected.");
  clients.add(ws);

  ws.on("error", (error: Error) => {
    console.log(`WebSocket error: ${error}`);
  });

  ws.on("message", (message: WebSocket.Data) => {
    const op = "websocket.onMessage"

    const data = JSON.parse(message as string);

    try {
      const txData: ITxData = {
        flag: data.flag,
        args: {
          player_address: data.playerAddress,
          betting_amount: data.bettingAmount,
          package_id: data.packageObjectId,
          game_table_id: data.gameTableObjectId,
        },
        ws: ws,
      }

      txQueue.push(txData);

      if(!isProcessing) {
        processNextTx();
      }
    } catch (e) {
      // TODO websocket은 에러 처리를 어떻게 해야하지?
      console.error(op + ': Error submitting transaction: ', e);
      ws.send(JSON.stringify({ error: e }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});
