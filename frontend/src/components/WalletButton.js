import { useWallet } from "@suiet/wallet-kit";
import { ConnectButton } from "@suiet/wallet-kit";
import { useEffect } from "react";
import "@suiet/wallet-kit/style.css";
import "./suiet-wallet-kit-custom.css";
import { useNavigate } from "react-router-dom";

function WalletButton() {
  const wallet = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (wallet.status === "connected") {
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
