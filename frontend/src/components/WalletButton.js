import { useWallet } from "@suiet/wallet-kit";
import { ConnectButton } from "@suiet/wallet-kit";
import { useEffect } from "react";
import "@suiet/wallet-kit/style.css";
import "./suiet-wallet-kit-custom.css";
import { useNavigate } from "react-router-dom";

function WalletButton() {
  const navigate = useNavigate();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.status == "connected") {
      console.log("walletbutton wallet status: ", wallet.status);
      console.log("walletbutton wallet address: ", wallet.account.address);
      console.log("walletbutton wallect balance: ", wallet);
      navigate("/game");
    } else {
      console.log("walletbutton wallet status2", wallet.status);
      navigate("/");
    }
  }, [wallet.connected]);

  return (
    <ConnectButton
    // The BaseError instance has properties like {code, message, details}
    // for developers to further customize their error handling.
    // onConnectError={(err) => {
    //     if (err.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
    //         console.warn('user rejected the connection to ' + err.details?.wallet);
    //     } else {
    //         console.warn('unknown connect error: ', err);
    //     }
    // }}
    >
      Connect Your Wallet
    </ConnectButton>
  );
}

export default WalletButton;
