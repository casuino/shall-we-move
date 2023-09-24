import React, { useState, useEffect } from "react";
import { CircularProgress, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Box } from "@mui/material";
import BlackJack from "../components/BlackJack.tsx";
import BettingAmount from "../components/BettingAmount";
import bg_landing from "../images/bg_landing.jpg";
import {
  fetchGameTableObject,
  fetchAllGameTables,
} from "../components/GetFunctions";
import GameTableList from "../components/GameTableList";
import bgSound from "../images/bg_sound.mp3";
import buttonSound from "../images/button_sound.mp3";
import useSound from "use-sound";

import { useWallet } from "@suiet/wallet-kit";
import { SuiClient } from "@mysten/sui.js/client";
import {getMyChipBalance} from "../transactions/exchangeTx.ts";
import {SUI_FULLNODE_DEVNET_ENDPOINT} from "../const/_const";

const Game = () => {
  const [playButtonSound] = useSound(buttonSound);
  const [playBgSound, { stop }] = useSound(bgSound, { volume: 1, loop: true });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [gameTableObjectId, setGameTableObjectId] = useState("");
  const [gameTableConfirmed, setGameTableConfirmed] = useState(false);
  const [bettingAmount, setBettingAmount] = useState("0.0001");
  const [balance, setBalance] = useState(0);
  const [bettingConfirmed, setBettingConfirmed] = useState(false);
  const [error, setError] = useState(false);

  const [isPlaying, setIsPlaying] = useState(0);
  const [winner, setWinner] = useState(0);
  const [gameTableData, setGameTableData] = useState({});
  const [cardDeckData, setCardDeckData] = useState({});
  const [dealerHandData, setDealerHandData] = useState({});
  const [playerHandData, setPlayerHandData] = useState({});
  const [allGameTables, setAllGameTables] = useState([]);

  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    console.log("gameTableConfirmed: ", gameTableConfirmed);
    console.log("Gametable Object Id: ", gameTableObjectId);
  }, [gameTableConfirmed, gameTableObjectId]);

  useEffect(() => {
    fetchAllGameTables(setAllGameTables);
    // connect to a custom RPC server
    const suiClient = new SuiClient({
      url: SUI_FULLNODE_DEVNET_ENDPOINT,
    });

    // async function getAllCoins() {
    //   const allCoins = await suiClient.getAllCoins({
    //     owner: wallet.account.address,
    //   });
    //
    //   // console.log("sdk: ", allCoins);
    //   setBalance(allCoins.data[0].balance);
    // }

    getMyChipBalance(wallet).then((balance) => {
        setBalance(balance);
    })

    // getAllCoins().catch(console.error);
  }, [loading]);

  useEffect(() => {
    if (bettingAmount !== "") {
      if (isNaN(bettingAmount) || bettingAmount <= 0) {
        setError("Please input a valid number");
      } else if (bettingAmount > balance) {
        setError(`Insufficient wallet balance`);
      } else {
        setError(false);
      }
    }
  }, [bettingAmount, balance]);

  async function getGameTableObjectData(gametable_object_id) {
    fetchGameTableObject(
      gametable_object_id,
      setGameTableData,
      setIsPlaying,
      setWinner,
      setCardDeckData,
      setDealerHandData,
      setPlayerHandData,
      setGameTableConfirmed,
      setLoading,
      setBettingAmount
    );
  }

  const handlGameTableButtonClick = (objectId) => {
    playButtonSound();
    playBgSound();
    getGameTableObjectData(objectId);
    // TODO:
  };

  const handleStartButtonClick = () => {
    setBettingConfirmed(true);
  };

  const resetGame = () => {
    setGameTableObjectId("");
    setGameTableConfirmed(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "space-around",
        height: "100vh",
        backgroundImage: `url(${bg_landing})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: "60%",
            left: "50%",
            width: "100px",
            height: "100px",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      )}
      {gameTableConfirmed ? (
        <Box>
          {bettingConfirmed || isPlaying >= 1 ? (
            <BlackJack
              resetGame={resetGame}
              // gameTableData={gameTableData}
              cardDeckData={cardDeckData}
              dealerHandData={dealerHandData}
              playerHandData={playerHandData}
              getGameTableObjectData={getGameTableObjectData}
              gameTableObjectId={gameTableObjectId}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              bettingAmount={bettingAmount}
              winner={winner}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <BettingAmount
              setBettingAmount={setBettingAmount}
              error={error}
              setError={setError}
              handleStartButtonClick={handleStartButtonClick}
              bettingAmount={bettingAmount}
              balance={balance}
              setBalance={setBalance}
            />
          )}
        </Box>
      ) : (
        <GameTableList
          allGameTables={allGameTables}
          gameTableObjectId={gameTableObjectId}
          setGameTableObjectId={setGameTableObjectId}
          handlGameTableButtonClick={handlGameTableButtonClick}
          setLoading={setLoading}
        />
      )}
    </Box>
  );
};

export default Game;
