import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import Game from "./pages/Game";
import Landing from "./pages/Landing";
import Tutorial from "./pages/Tutorial";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { WalletProvider, useWallet } from "@suiet/wallet-kit";
import { RecoilRoot } from "recoil";
import Exchange from "./pages/Exchange";

export default function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <CssBaseline />
          <Box sx={{ flexGrow: 1 }}>
            <WalletProvider
              chains={[
                {
                  id: "sui:testnet",
                  name: "Sui Testnet",
                  rpcUrl: "https://sui-testnet.nodeinfra.com",
                },
              ]}
            >
              {location.pathname !== "/tutorial" && <Navbar />}
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/game" element={<Game />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/tutorial" element={<Tutorial />} />
              </Routes>
            </WalletProvider>
          </Box>
        </ColorModeContext.Provider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
