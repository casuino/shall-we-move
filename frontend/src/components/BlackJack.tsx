import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import BackgroundImage from "../images/background.jpg";
import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import GameTableInfo from "./GameTableInfo";
import { SuiSignAndExecuteTransactionBlockInput } from "@mysten/wallet-standard";
import CardDeck from "./CardDeck";
import DealerCardsBox from "./DealerCardsBox";
import PlayerCardsBox from "./PlayerCardsBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./SideBar";
import useSound from "use-sound";
import GameTableScore from "./GameTableScore";
import {
  DEALER_ADDRESSES_DEVNET,
  GAME_INFO_OBJECT_ID_DEVNET,
  GAS_BUDGET,
  PACKAGE_ID_DEVNET,
  REAL_NUMS
} from "../const/_const";
import {getMyChips} from "../transactions/exchangeTx";

// Create a WebSocket connection
const socket = new WebSocket(
    process.env.mode === "production" ? "ws://shallwemove.xyz:8080" : "ws://localhost:8080"
);

// const BlackJack: React.FC = () => {
const BlackJack = ({
  gameTableData,
  cardDeckData,
  dealerHandData,
  playerHandData,
  getGameTableObjectData,
  gameTableObjectId,
  isPlaying,
  bettingAmount,
  winner,
  loading,
  setLoading,
}) => {
  const [playerTotal, setPlayerTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);

  const wallet = useWallet();

  const [playButtonSound] = useSound("/button_sound.mp3");

  // ----------------------------------------------------------------------------------
  useEffect(() => {
    if (wallet.status === "connected") {
      console.log("blackjack wallet status: ", wallet.status);
      console.log("blackjack wallect balance: ", wallet.address);
    } else {
      console.log("blackjack wallet status", wallet.status);
    }
    console.log("betting amount : ", bettingAmount);
  }, [wallet.connected]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      toast(data.flag + "  TxID:" + data.digest, { autoClose: 2000 });
      console.log("this is the data: ", data);

      switch (data.flag) {
        case "start game done":
          await getGameTableObjectData(gameTableObjectId);
          console.log("game start done!!!!!");
          break;

        case "get card done":
          await getGameTableObjectData(gameTableObjectId);
          console.log("get card done!!!!!");
          break;

        case "end game (stand) done":
          // handle Stop done
          await getGameTableObjectData(gameTableObjectId);
          console.log("game end done!!!!!");
          break;

        case "settle up game done":
          // handle Stop done
          await getGameTableObjectData(gameTableObjectId);
          console.log("settle up game done!!!!!");
          break;

        case "fill card done":
          // handle Stop done
          await getGameTableObjectData(gameTableObjectId);
          console.log("fill card done!!!!!");
          break;

        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    let total = 0;
    if (isPlaying >= 1) {
      for (let i = 0; i < playerHandData.cards.length; i++) {
        let num = parseInt(playerHandData.cards[i].card_number);
        if (num < 10000) {
          num %= 13;
          total += REAL_NUMS[num];
        }
      }
      setPlayerTotal(total);

      total = 0;
      for (let i = 0; i < dealerHandData.cards.length; i++) {
        let num = parseInt(dealerHandData.cards[i].card_number);
        if (num < 10000) {
          num %= 13;
          total += REAL_NUMS[num];
        }
      }
      setDealerTotal(total);
    }
  }, [playerHandData, dealerHandData, isPlaying]);

  // ----------------------------------------------------------------------------------
  // now this function works!
  const readyGame = async () => {
    const txb = new TransactionBlock();
    const bettingAmount_mist = Math.floor(
      parseFloat(bettingAmount) * 1000000000
    );

    const myChips = await getMyChips(wallet);

    let chip = null;
    let balanceSum = 0;
    const chipIdArr = [];
    for(let i = 0; i < myChips.length; i++){
        const chipBalance = parseInt(myChips[i].balance, 10);

        // 1개 chip으로 bettingAmount_mist 만큼을 cover할 수 있는 경우
        if(chipBalance >= bettingAmount_mist){
            const [coin] = txb.splitCoins(txb.object(myChips[i].coinObjectId), [txb.pure(bettingAmount_mist)]);
            chip = coin;
            break;
        }

      balanceSum += chipBalance;
      chipIdArr.push(myChips[i].coinObjectId);
      // 여러 개 chip 합쳐서 bettingAmount_mist 만큼을 cover할 수 있는 경우
      if(balanceSum >= bettingAmount_mist){
        const sourceCoins = [];
        for(let j = 1; j < chipIdArr.length; j++){
          sourceCoins.push(txb.object(chipIdArr[j]));
        }
        txb.mergeCoins(txb.object(chipIdArr[0]), sourceCoins);
        const [coin] = txb.splitCoins(txb.object(chipIdArr[0]), [txb.pure(bettingAmount_mist)]);
        chip = coin;
        break;
      }
    }

    // bettingAmount_mist 만큼을 cover할 수 있는 chip이 없는 경우
    if(chip === null){
        toast("Not enough chips", { autoClose: 2000 });
        return;
    }

    console.log("Ready Game chip: ", chip);
    txb.setGasBudget(GAS_BUDGET);
    txb.moveCall({
      target: `${PACKAGE_ID_DEVNET}::blackjack::ready_game`,
      arguments: [
        txb.object(GAME_INFO_OBJECT_ID_DEVNET),
        txb.object(gameTableObjectId),
        chip,
      ],
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
      transactionBlock: txb,
      account: wallet.account!,
      chain: "sui:devnet",
    };

    try {
      const result = await wallet.signAndExecuteTransactionBlock(stx);
      console.log("Ready Game: ", result);
    } catch (err) {
      console.log("Ready Game Error: ",err);
    }
  };

  const cancelReadyGame = async () => {
    const tx = new TransactionBlock();
    tx.setGasBudget(GAS_BUDGET);
    tx.moveCall({
      target: `${PACKAGE_ID_DEVNET}::blackjack::cancel_ready_game`,
      arguments: [
        tx.object(GAME_INFO_OBJECT_ID_DEVNET),
        tx.object(gameTableObjectId),
      ],
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
      transactionBlock: tx,
      account: wallet.account!,
      chain: "sui:devnet",
    };

    try {
      const result = await wallet.signAndExecuteTransactionBlock(stx);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  // ----------------------------------------------------------------------------------
  // Socket send flag
  const handleGameReady = async () => {
    if (isPlaying == 0) {
      playButtonSound();

      setLoading(true);
      await readyGame();
      await getGameTableObjectData(gameTableObjectId);
      console.log("game ready done!!!!!");
    }
  };
  const handleCancelGameReady = async () => {
    if (isPlaying == 1) {
      playButtonSound();

      setLoading(true);
      await cancelReadyGame();
      await getGameTableObjectData(gameTableObjectId);

      console.log("cancel game ready done!!!!!");
    }
  };

  const handleGameStart = () => {
    if (isPlaying == 1) {
      playButtonSound();

      setLoading(true);
      socket.send(
        JSON.stringify({
          flag: "Start Game",
          packageObjectId: PACKAGE_ID_DEVNET,
          gameTableObjectId: gameTableObjectId,
          playerAddress: wallet.address,
          bettingAmount: bettingAmount,
        })
      );
    }
  };

  const handleHit = async () => {
    if (!loading && isPlaying == 2) {
      playButtonSound();

      setLoading(true);
      socket.send(
        JSON.stringify({
          flag: "Go Card",
          packageObjectId: PACKAGE_ID_DEVNET,
          gameTableObjectId: gameTableObjectId,
          playerAddress: wallet.address,
        })
      );
    }
  };

  const handleStand = () => {
    if (isPlaying == 2) {
      setLoading(true);

      playButtonSound();
      socket.send(
        JSON.stringify({
          flag: "End Game (Stand)",
          packageObjectId: PACKAGE_ID_DEVNET,
          gameTableObjectId: gameTableObjectId,
          playerAddress: wallet.address,
        })
      );
    }
  };

  const handleSettleUpGame = () => {
    if (isPlaying == 3) {
      setLoading(true);

      playButtonSound();
      socket.send(
        JSON.stringify({
          flag: "Settle Up Game",
          packageObjectId: PACKAGE_ID_DEVNET,
          gameTableObjectId: gameTableObjectId,
          playerAddress: wallet.address,
        })
      );
    }
  };

  const handleFillCard = () => {
    setLoading(true);

    playButtonSound();
    socket.send(
      JSON.stringify({
        flag: "Fill Cards",
        packageObjectId: PACKAGE_ID_DEVNET,
        gameTableObjectId: gameTableObjectId,
        playerAddress: wallet.address,
      })
    );
  };

  // --------------------------------------------------------------------

  return (
    <Box
      sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        paddingTop: "14vh",
        paddingX: "50px",
      }}
    >
      <GameTableInfo
        gameTableObjectId={gameTableObjectId}
        playerHandData={playerHandData}
        isPlaying={isPlaying}
        bettingAmount={bettingAmount}
      />

      {isPlaying == 3 &&
        (winner == 1 ? (
          <h2>Player Win! Congrats!</h2>
        ) : winner == 2 ? (
          <h2>Dealer Win</h2>
        ) : (
          <h2>Draw!</h2>
        ))}

      <GameTableScore
        isPlaying={isPlaying}
        dealerHandData={dealerHandData}
        dealerTotal={dealerTotal}
        playerHandData={playerHandData}
        playerTotal={playerTotal}
      />

      {/* Card Deck : handleHit 빼는 것 어떻습니까? by TW*/}
      {isPlaying >= 1 ? (
        <CardDeck
          cardDeckData={cardDeckData}
          handleHit={handleHit}
          loading={loading}
        />
      ) : (
        <Box />
      )}

      {/* Dealer Cards Box */}
      {isPlaying >= 2 ? (
        <DealerCardsBox dealerHandData={dealerHandData} isPlaying={isPlaying} />
      ) : (
        <Box />
      )}

      {/* Player Cards Box */}
      {isPlaying >= 2 ? (
        <PlayerCardsBox playerHandData={playerHandData} />
      ) : (
        <Box />
      )}

      <ToastContainer
        position="bottom-right"
        newestOnTop
        pauseOnFocusLoss={false}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          width: "60vw",
          position: "fixed",
          bottom: "50px",
          left: "20vw",
        }}
      >
        {isPlaying == 0 && loading == false && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "120px", fontWeight: "800" }}
            onClick={handleGameReady}
          >
            Game Ready
          </Button>
        )}

        {isPlaying == 1 && loading == false && (
          <Button
            variant="contained"
            color="warning"
            sx={{ width: "120px", fontWeight: "800" }}
            onClick={handleCancelGameReady}
          >
            Cancel Ready
          </Button>
        )}
        {isPlaying == 1 && loading == false && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "120px", fontWeight: "800" }}
            onClick={handleGameStart}
          >
            Game Start
          </Button>
        )}

        {isPlaying == 2 && loading == false && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "120px", fontWeight: "800" }}
            onClick={handleHit}
          >
            Hit
          </Button>
        )}
        {isPlaying == 2 && loading == false && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "120px", fontWeight: "800" }}
            onClick={handleStand}
          >
            Stand
          </Button>
        )}

        {isPlaying == 3 && loading == false && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "120px", fontWeight: "800" }}
            onClick={handleSettleUpGame}
          >
            Settle Up Game
          </Button>
        )}

        {loading == false &&
        DEALER_ADDRESSES_DEVNET.includes(wallet.address!) ? (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "120px", fontWeight: "800" }}
            onClick={handleFillCard}
          >
            Fill Card
          </Button>
        ) : (
          <Box />
        )}
      </Box>
    </Box>
  );
};

export default BlackJack;
