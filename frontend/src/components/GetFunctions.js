import axios from "axios";
import config from "../config.json";

const socket = new WebSocket(
    process.env.mode === "production" ? "wss://shallwemove.xyz:8080" : "wss://localhost:8080"
);

export async function getObject(object_id) {
  const response = await axios.post(config.TESTNET_ENDPOINT, {
    jsonrpc: "2.0",
    id: 1,
    method: "sui_getObject",
    params: [
      object_id,
      {
        showType: true,
        showOwner: true,
        showPreviousTransaction: false,
        showDisplay: false,
        showContent: true,
        showBcs: false,
        showStorageRebate: false,
      },
    ],
  });
  // console.log(response);
  return response;
}

export async function getMultiObjects(object_id_array) {
  const response = await axios.post(config.TESTNET_ENDPOINT, {
    jsonrpc: "2.0",
    id: 1,
    method: "sui_multiGetObjects",
    params: [
      object_id_array,
      {
        showType: true,
        showOwner: true,
        showPreviousTransaction: false,
        showDisplay: false,
        showContent: true,
        showBcs: false,
        showStorageRebate: false,
      },
    ],
  });
  // console.log("get multi objects: ",response);
  return response;
}

export async function pushCardsDataFrom(data) {
  let card_id_array = [];
  for (let i = 0; i < data.cards.length; i++) {
    if (data.cards[i] != null) {
      card_id_array.push(data.cards[i]);
    }
  }
  const response = await getMultiObjects(card_id_array);
  let card_data_array = [];
  for (let i = 0; i < response.data.result.length; i++) {
    card_data_array.push(response.data.result[i].data.content.fields);
  }

  data.cards = card_data_array;
}

export async function fetchGameTableObject(
  gameTableObjectId,
  setGameTableData,
  setIsPlaying,
  setWinner,
  setCardDeckData,
  setDealerHandData,
  setPlayerHandData,
  setGameTableConfirmed,
  setLoading,
  setBettingAmount
) {
  const gametable_response = await getObject(gameTableObjectId);

  try {
    setGameTableData(gametable_response.data.result.data.content.fields);
    const is_playing =
      gametable_response.data.result.data.content.fields.is_playing;
    const winner = gametable_response.data.result.data.content.fields.winner;

    const READY = 1;
    if (is_playing >= READY) {
      // console.log("This Game Table is ready or start ", is_playing);
      const card_deck_id =
        gametable_response.data.result.data.content.fields.card_deck;
      const dealer_hand_id =
        gametable_response.data.result.data.content.fields.dealer_hand;
      const player_hand_id =
        gametable_response.data.result.data.content.fields.player_hand;
      const money_box_id =
        gametable_response.data.result.data.content.fields.money_box;

      const all_response = await getMultiObjects([
        card_deck_id,
        dealer_hand_id,
        player_hand_id,
        money_box_id,
      ]);
      let card_deck = all_response.data.result[0].data.content.fields;
      let dealer_hand = all_response.data.result[1].data.content.fields;
      let player_hand = all_response.data.result[2].data.content.fields;
      if (card_deck.current_number_of_cards < 15) {
        socket.send(
          JSON.stringify({
            flag: "Fill Cards",
            packageObjectId: config.PACKAGE_OBJECT_ID,
            gameTableObjectId: gameTableObjectId,
            playerAddress: player_hand.account,
          })
        );
        setTimeout(function () {}, 2500);
      }
      let player_bet_id =
        all_response.data.result[3].data.content.fields.player_bet;
      let player_bet = await getObject(player_bet_id);
      let player_bet_amount =
        player_bet.data.result.data.content.fields.balance;

      // push card information to dealer, player hand from card object ids of dealer, player hand
      await pushCardsDataFrom(dealer_hand);
      await pushCardsDataFrom(player_hand);

      // set Card Deck, Dealer Hand, Player Hand
      setCardDeckData(card_deck);
      setDealerHandData(dealer_hand);
      setPlayerHandData(player_hand);
      setBettingAmount(player_bet_amount / 1000000000);
    } else if (is_playing < READY) {
      setPlayerHandData({});
    }
    setIsPlaying(is_playing);
    setWinner(winner);
    setGameTableConfirmed(true);
    setLoading(false);
  } catch (err) {
    console.log("error for getting game table information");
    setGameTableConfirmed(false);
    setLoading(false);
  }
}

// game table id 전부 가져오기
export async function getAllGames() {
  const response = await getMultiObjects(config.GAME_TABLES);
  console.log("All Game Response: ", response);
  return response;
}

export async function fetchAllGameTables(setAllGameTables) {
  const res = await getAllGames();
  console.log("fetchAllGameTables");

  try {
    setAllGameTables(res.data.result);
  } catch (err) {
    console.log("error for getting all game tables");
  }
}
