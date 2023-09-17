import React, { useState, useEffect } from "react";
import tutorialBackground from "../images/tutorial_background.png";
import { Box, Button } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import WalletButton from "../components/WalletButton";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@suiet/wallet-kit";
import useSound from "use-sound";

const typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const Background = styled(Box)({
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: `url(${tutorialBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const OptionsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 80,
  height: "45vh",
});

const OptionButton = styled(Button)({
  width: "674px",
  height: "91px",
  background: "#000000 0% 0% no-repeat padding-box",
  border: "1px solid #707070",
  borderRadius: "23px",
  opacity: 0.58,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 40,
  font: "normal normal 800 32px/38px Tenada",
});

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

const SkipButton = styled(Button)({
  width: "100px",
  height: "50px",
  backgroundColor: "black",
  border: "1px solid #707070",
  borderRadius: "30px",
});

const chatFlow = {
  cashierFirst: {
    message: "여긴 처음이요?",
    option1: "네",
    option2: "아니요",
  },
  cashierSecondOnOption1Click: {
    message: "여긴 어떻게 알고 온거요? 아, 됐고, SUI 토큰은 있소?",
    option1: "SUI 토큰 있소",
    option2: "SUI 토큰 없소",
  },
  cashierThirdOnOption1Click: {
    message: "그렇군요! SUI 토큰을 환전하고 카지노를 플레이 하세요!",
    option1: "exchange button",
    option2: "disabled",
  },
  cashierThirdOnOption2Click: {
    message: "SUI 토큰부터 사러 가시죠",
    option1: "wallet button",
    option2: "disabled",
  },
  cashierThiredOnOption2Click: {
    message: "가서 SUI 토큰부터 사 오시오!",
    option1: "game button",
    option2: "exchange button",
  },
  cashierSecondOnOption2Click: {
    message: "전에 연결한 SUI 지갑을 연동하시오!",
    option1: "wallet button",
    option2: "disabled",
  },
  cashierFirstOnWalletTrue: {
    message: "또 왔소?",
    option1: "game button",
    option2: "exchange button",
  },

  cashierWalletConnectFirstTime: {
    message: "축하합니다. 당신은 이제 CHIPSUI 를 환전할 수 있습니다.",
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
    <Background>
      <OptionsContainer>
        {chatFlow[currentFlow].option1 !== "disabled" && (
          <OptionButton
            variant="contained"
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
          <SkipButton variant="contained">skip</SkipButton>
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
