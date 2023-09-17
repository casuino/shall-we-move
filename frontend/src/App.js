import { Route, Routes, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import Game from "./pages/Game";
import Landing from "./pages/Landing";
import Tutorial from "./pages/Tutorial";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { WalletProvider } from "@suiet/wallet-kit";
import Exchange from "./pages/Exchange";

export default function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  return (
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
            {location.pathname !== "/tutorial" &&
              location.pathname !== "/exchange" && <Navbar />}
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
  );
}
