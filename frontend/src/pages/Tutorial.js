import React, { useState, useEffect } from "react";
import tutorialBackground from "../images/tutorial_background.png";
import { Box, Button } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import WalletButton from "../components/WalletButton";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@suiet/wallet-kit";
import useSound from "use-sound";
import tutorialBackground1 from "../images/tutorial1.png";
import tutorialBackground2 from "../images/tutorial2.png";

const typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const Background = styled(Box)(({ isFirst }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: isFirst
    ? `url(${tutorialBackground1})`
    : `url(${tutorialBackground2})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

const OptionsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 80,
  height: "45vh",
});

const OptionButton = styled(Button)(({ hasWalletButton }) => ({
  width: "674px",
  height: "91px",
  background: hasWalletButton
    ? "#0180FF"
    : "#000000 0% 0% no-repeat padding-box",
  border: "1px solid #707070",
  borderRadius: "23px",
  opacity: 0.58,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 40,
  font: "normal normal 800 32px/38px Tenada",
  "&:hover": {
    background: hasWalletButton ? "#0172E5" : "#000000",
  },
}));

const MessageContainer = styled(Box)({
  width: "85vw",
  height: "35vh",
});

const MessageBox = styled(Box)(({ theme }) => ({
  width: "85vw",
  height: "25vh",
  background: "#000000 0% 0% no-repeat padding-box",
  border: "1px solid #707070",
  borderRadius: "23px",
  opacity: 0.58,
  display: "flex",
  flexDirection: "column",
  padding: 36,
  // alignItems: "center",
  // justifyContent: "center",
  font: "normal normal 800 32px/38px Tenada",
}));

const TypingText = styled("span")({
  whiteSpace: "nowrap",
  overflow: "hidden",
  animation: `${typing} 2s steps(40, end)`,
});

const Header = styled(Box)({
  width: "85vw",
  height: "30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
});

const Cashier = styled(Box)({
  width: "350px",
  height: "50px",
  background: "#000000 0% 0% no-repeat padding-box",
  border: "1px solid #707070",
  borderRadius: "23px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const chatFlow = {
  cashierFirst: {
    message: "Is this your first time?",
    option1: "yes",
    option2: "no",
  },
  cashierSecondOnOption1Click: {
    message: "How did you get here? ..Anyway, you got some SUI coin?",
    option1: "Yes I do",
    option2: "No I don't",
  },
  cashierThirdOnOption1Click: {
    message: "Good, now exchange for SUICOIN and play!",
    option1: "exchange button",
    option2: "disabled",
  },
  cashierThirdOnOption2Click: {
    message: "Let's get you some SUI coin first..",
    option1: "wallet button",
    option2: "disabled",
  },
  cashierThiredOnOption2Click: {
    message: "Go get some SUI coin first!",
    option1: "game button",
    option2: "exchange button",
  },
  cashierSecondOnOption2Click: {
    message: "Connect your SUI wallet first!",
    option1: "wallet button",
    option2: "disabled",
  },
  cashierFirstOnWalletTrue: {
    message: "Here you come again?",
    option1: "game button",
    option2: "exchange button",
  },

  cashierWalletConnectFirstTime: {
    message: "Great, now you can get some CHIPSUI",
    option1: "exchange button",
    option2: "disabled",
  },
};

const Tutorial = () => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [animationKey, setAnimationKey] = useState(0);
  const [walletConnectFirstTime, setWalletConnectFirstTime] = useState(false);
  const [currentFlow, setCurrentFlow] = useState("cashierFirst");
  const [playButtonSound] = useSound("/button_sound.mp3");

  useEffect(() => {
    console.log("wallet.status: ", wallet.status);

    if (wallet.status === "connected") {
      if (walletConnectFirstTime) {
        setCurrentFlow("cashierWalletConnectFirstTime");
      } else {
        setCurrentFlow("cashierFirstOnWalletTrue");
      }
    } else {
      setCurrentFlow("cashierFirst");
    }
  }, [wallet.status]);

  console.log("current flow: ", currentFlow);

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [currentFlow]);

  const handleOptionClick = (option) => {
    playButtonSound();
    const selectedOptionValue = chatFlow[currentFlow][option];

    if (selectedOptionValue === "game button") {
      navigate("/game");
      return;
    } else if (selectedOptionValue === "exchange button") {
      navigate("/exchange");
      return;
    }

    switch (currentFlow) {
      case "cashierFirst":
        setCurrentFlow(
          option === "option1"
            ? "cashierSecondOnOption1Click"
            : "cashierSecondOnOption2Click"
        );
        break;

      case "cashierSecondOnOption1Click":
        setCurrentFlow(
          option === "option1"
            ? "cashierThirdOnOption1Click"
            : "cashierThirdOnOption2Click"
        );
        break;

      case "cashierThirdOnOption2Click":
        if (option === "option1") {
          setWalletConnectFirstTime(true); // Set walletConnectFirstTime to true here
        }
        break;

      default:
        break;
    }
  };

  return (
    <Background isFirst={false}>
      <OptionsContainer>
        {chatFlow[currentFlow].option1 !== "disabled" && (
          <OptionButton
            variant="contained"
            hasWalletButton={chatFlow[currentFlow].option1 === "wallet button"}
            onClick={() => handleOptionClick("option1")}
          >
            {chatFlow[currentFlow].option1 === "wallet button" ? (
              <WalletButton />
            ) : (
              chatFlow[currentFlow].option1
            )}
          </OptionButton>
        )}
        {chatFlow[currentFlow].option2 !== "disabled" && (
          <OptionButton
            variant="contained"
            hasWalletButton={chatFlow[currentFlow].option1 === "wallet button"}
            onClick={() => handleOptionClick("option2")}
          >
            {chatFlow[currentFlow].option2 === "wallet button" ? (
              <WalletButton />
            ) : (
              chatFlow[currentFlow].option2
            )}
          </OptionButton>
        )}
      </OptionsContainer>
      <MessageContainer>
        <Header>
          <Cashier>Cashier</Cashier>
        </Header>
        <MessageBox>
          <TypingText key={animationKey}>
            {chatFlow[currentFlow].message}
          </TypingText>
        </MessageBox>
      </MessageContainer>
    </Background>
  );
};

export default Tutorial;
