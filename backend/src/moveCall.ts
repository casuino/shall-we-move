import {
  JsonRpcProvider,
  Connection,
  Ed25519Keypair,
  fromB64,
  RawSigner,
  SIGNATURE_SCHEME_TO_FLAG,
  PRIVATE_KEY_SIZE,
  TransactionBlock,
} from "@mysten/sui.js";
import dotenv from "dotenv";

dotenv.config();

const MODULE_NAME = "blackjack";
const GAS_BUDGET = 30000000;
const FILL_CARD_DECK_GAS_BUDEGT = 500000000;
const MIST_PER_SUI = 1000000000;

const START_GAME_FN_NAME = "start_game";
const GO_CARD_FN_NAME = "pass_card_to_player";
const END_GAME_FN_NAME = "end_game";
const SETTLE_UP_GAME_FN_NAME = "settle_up_game";
const FILL_CARD_DECK_FN_NAME = "fill_10_cards_to_card_deck";

export interface ITxResponse {
    flag: string;
    digest: string;
    effects: any;
    events: any;
    objectChanges: any;
    transaction: any;
}

export const getProvider = (
  fullnode: string,
  faucet?: string
): JsonRpcProvider => {
  const connection = new Connection({
    fullnode,
    faucet,
  });
  return new JsonRpcProvider(connection);
};

export const getSigner = (
  privateKey: string,
  provider: JsonRpcProvider
): RawSigner => {
  const raw = fromB64(privateKey);
  if (
    raw[0] !== SIGNATURE_SCHEME_TO_FLAG.ED25519 ||
    raw.length !== PRIVATE_KEY_SIZE + 1
  ) {
    throw new Error("invalid key");
  }

  const keypair = Ed25519Keypair.fromSecretKey(raw.slice(1));
  return new RawSigner(keypair, provider);
};

export const startGame = async (
  signer: RawSigner,
  player_address: string,
  betting_amount: string,
  package_id: string,
  game_table_id: string,
): Promise<ITxResponse> => {
  const tx = new TransactionBlock();
  const bettingAmount_mist = Math.floor(
    parseFloat(betting_amount) * MIST_PER_SUI
  );
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(bettingAmount_mist)]);
  tx.setGasBudget(GAS_BUDGET);

  tx.moveCall({
    target: `${package_id}::${MODULE_NAME}::${START_GAME_FN_NAME}`,
    arguments: [tx.object(game_table_id), coin, tx.pure(player_address)],
  });

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
      showInput: true,
    },
  });

  const data: ITxResponse = {
    flag: "start game done",
    digest: result.digest,
    effects: result.effects,
    events: result.events,
    objectChanges: result.objectChanges,
    transaction: result.transaction,
  };

  return data;
};

export const getRandomNumbers = (): string[] => {
  const numbers = Array.from({ length: 52 }, (_, index) =>
    (index + 1).toString()
  );
  const selectedNumbers: string[] = [];

  while (selectedNumbers.length < 10) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const selectedNumber = numbers.splice(randomIndex, 1)[0];
    selectedNumbers.push(selectedNumber);
  }

  const shuffledNumbers: string[] = [];

  while (selectedNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
    const removedNumber = selectedNumbers.splice(randomIndex, 1)[0];
    shuffledNumbers.push(removedNumber);
  }

  // console.log("shuffle numbers:", shuffledNumbers);
  return shuffledNumbers;
};

export const fillCardDeck = async (
  signer: RawSigner,
  package_id: string,
  game_table_id: string,
): Promise<ITxResponse> => {
  const tx = new TransactionBlock();
  tx.setGasBudget(FILL_CARD_DECK_GAS_BUDEGT);

  let shuffle_cards = getRandomNumbers();
  tx.moveCall({
    target: `${package_id}::${MODULE_NAME}::${FILL_CARD_DECK_FN_NAME}`,
    arguments: [
      tx.object(game_table_id),
      tx.pure(parseInt(shuffle_cards[0])),
      tx.pure(parseInt(shuffle_cards[1])),
      tx.pure(parseInt(shuffle_cards[2])),
      tx.pure(parseInt(shuffle_cards[3])),
      tx.pure(parseInt(shuffle_cards[4])),
      tx.pure(parseInt(shuffle_cards[5])),
      tx.pure(parseInt(shuffle_cards[6])),
      tx.pure(parseInt(shuffle_cards[7])),
      tx.pure(parseInt(shuffle_cards[8])),
      tx.pure(parseInt(shuffle_cards[9])),
    ],
  });
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
      showInput: true,
    },
  });

  const data = {
    flag: "fill card done",
    digest: result.digest,
    effects: result.effects,
    events: result.events,
    objectChanges: result.objectChanges,
    transaction: result.transaction,
  };
  return data;
};

export const goCard = async (
  signer: RawSigner,
  package_id: string,
  game_table_id: string,
  player_address: string,
): Promise<ITxResponse> => {
  const tx = new TransactionBlock();
  tx.setGasBudget(GAS_BUDGET);
  tx.moveCall({
    target: `${package_id}::${MODULE_NAME}::${GO_CARD_FN_NAME}`,
    arguments: [tx.object(game_table_id), tx.pure(player_address)],
  });

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
      showInput: true,
    },
  });

  const data = {
    flag: "get card done",
    digest: result.digest,
    effects: result.effects,
    events: result.events,
    objectChanges: result.objectChanges,
    transaction: result.transaction,
  };

  return data;
};

export const endGame = async (
  signer: RawSigner,
  package_id: string,
  game_table_id: string,
): Promise<ITxResponse> => {
  const tx = new TransactionBlock();
  tx.setGasBudget(GAS_BUDGET);
  tx.moveCall({
    target: `${package_id}::${MODULE_NAME}::${END_GAME_FN_NAME}`,
    // arguments: [tx.object(game_table_id), tx.pure(1)],
    arguments: [tx.object(game_table_id)],
  });

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
      showInput: true,
    },
  });

  const data = {
    flag: "end game (stand) done",
    digest: result.digest,
    effects: result.effects,
    events: result.events,
    objectChanges: result.objectChanges,
    transaction: result.transaction,
  };
  return data;
};

export const settleUpGame = async (
  signer: RawSigner,
  package_id: string,
  game_table_id: string,
): Promise<ITxResponse> => {
  const tx = new TransactionBlock();
  tx.setGasBudget(GAS_BUDGET);
  tx.moveCall({
    target: `${package_id}::${MODULE_NAME}::${SETTLE_UP_GAME_FN_NAME}`,
    // arguments: [tx.object(game_table_id), tx.pure(1)],
    arguments: [tx.object(game_table_id)],
  });
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
      showInput: true,
    },
  });

  const data = {
    flag: "settle up game done",
    digest: result.digest,
    effects: result.effects,
    events: result.events,
    objectChanges: result.objectChanges,
    transaction: result.transaction,
  };
  return data;
};
