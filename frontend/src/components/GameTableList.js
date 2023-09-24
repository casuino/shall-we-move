import { Box, Grid, Typography } from "@mui/material";
import card from "../images/cards/card.png";
import { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Snackbar, Alert } from "@mui/material";

const GameTableList = ({
  allGameTables,
  setGameTableObjectId,
  handlGameTableButtonClick,
  setLoading,
}) => {
  const wallet = useWallet();
  const [gameTableOpens, setGameTableOpens] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const game_status = ["Available Game", "Ready", "Playing", "Game End"];

  useEffect(() => {
    setGameTableOpens(allGameTables.map((table) => false));
  }, [allGameTables]);

  return (
    allGameTables && (
      <Box
        sx={{
          marginX: "auto",
          width: "74%",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            margin: "20px auto",
            fontSize: "30px",
            fontWeight: "800",
          }}
        >
          Game Table List
        </Typography>
        <Grid container rowSpacing={3} columnSpacing={1}>
          {allGameTables.map((table, i) => (
            <Grid key={i} item xs={2}>
              <Box
                onClick={() => {
                  if (
                    table.data.content.fields.is_playing < 1 ||
                    table.data.content.fields.player_address === wallet.address
                  ) {
                    console.log("you can play the game");
                    setLoading(true);
                    setGameTableObjectId(table.data.objectId);
                    handlGameTableButtonClick(table.data.objectId);
                    setGameTableOpens(
                      gameTableOpens.map((open, j) => (i === j ? true : open))
                    );
                  } else {
                    setOpenSnackbar(true);
                    console.log("you can't play the game");
                  }
                }}
                sx={{
                  width: "160px",
                  height: "240px",
                  position: "relative",
                  marginX: "auto",
                  transformStyle: "preserve-3d",
                  transformOrigin: "center",
                  transition: "transform .5s",
                  transform: `${
                    gameTableOpens[i]
                      ? `rotateY(180deg) scale(1.1)`
                      : `rotateY(0deg)`
                  }`,
                  "&:hover": {
                    // transform: `rotateY(180deg) scale(1.1)`,
                    // transform: `${t.data.content.fields.is_playing >= 1 ? '' : 'scale(1.1)'}`,
                    transform: `${
                      gameTableOpens[i]
                        ? `rotateY(180deg) scale(1.1)`
                        : `rotateY(0deg) scale(1.1)`
                    }`,
                  },
                }}
              >
                <Typography
                  sx={{
                    zIndex: "15",
                    position: "absolute",
                    left: "10px",
                    top: "10px",
                    fontSize: "20px",
                    fontWeight: "700",
                    opacity: "0.8",
                  }}
                >
                  {game_status[parseInt(table.data.content.fields.is_playing)]}
                </Typography>
                <Box
                  sx={{
                    zIndex: "10",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    backgroundImage: `url(${card})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // cursor: `${t.data.content.fields.is_playing < 1 && 'pointer'}`,
                    cursor: "pointer",
                    backfaceVisibility: "hidden",
                    // opacity: `${t.data.content.fields.is_playing >= 1 ? '0.3' : '1'}`,
                  }}
                />

                <Box
                  sx={{
                    zIndex: "5",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    background: `url('/img/cards/heart/king.png')`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    transform: `rotateY(180deg)`,
                    // cursor: `${t.data.content.fields.is_playing < 1 && 'pointer'}`
                    cursor: "pointer",
                    backfaceVisibility: "hidden",
                    // opacity: `${t.data.content.fields.is_playing >= 1 ? '0.3' : '1'}`,
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            The table is taken by an other player!
          </Alert>
        </Snackbar>
      </Box>
    )
  );
};

export default GameTableList;
