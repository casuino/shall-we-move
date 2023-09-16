import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import WalletButton from "./WalletButton";
import card from "../images/cards/card.png";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0)",
        height: "7.36569rem",
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <a href="/">
          <img
            src={card}
            alt="card"
            style={{ height: "3.68284rem", width: "3.68284rem" }}
          />
        </a>
        <Typography
          variant="h3"
          component="div"
          sx={{ flexGrow: 1, color: "#0054E7" }}
        ></Typography>
        <WalletButton />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
