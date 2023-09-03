import React from "react";
import { Box, Chip } from "@mui/material";

const GameTableInfo = ({
  gameTableObjectId,
  playerHandData,
  isPlaying,
  bettingAmount,
}) => {
  return (
    <Box
      sx={{
        margin: "20px 0 50px 0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "0",
        }}
      >
        <h4 style={{ margin: "8px 5px 8px 0" }}>Blackjack Game Table : </h4>
        <Chip
          sx={{
            color: "warning",
            fontWeight: "800",
          }}
          label={gameTableObjectId}
          color="warning"
          variant="outlined"
          size="small"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "0",
        }}
      >
        <h4 style={{ margin: "8px 5px 8px 0" }}>Player : </h4>
        <Chip
          sx={{
            color: "warning",
            fontWeight: "800",
          }}
          label={playerHandData.account}
          color="warning"
          variant="outlined"
          size="small"
        />
      </Box>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0px",
        }}
      >
        <h4 style={{ margin: "8px 5px 8px 0" }}>Game Status :</h4>
        <Chip
          sx={{
            color: "info",
            fontWeight: "800",
          }}
          label={
            isPlaying == 0
              ? "Not Ready"
              : isPlaying == 1
              ? "Ready"
              : isPlaying == 2
              ? "Playing"
              : "End"
          }
          color={
            isPlaying == 0
              ? "error"
              : isPlaying == 1
              ? "info"
              : isPlaying == 2
              ? "secondary"
              : "primary"
          }
          size="small"
        />
      </div>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "0",
        }}
      >
        <h4 style={{ margin: "8px 5px 8px 0" }}>Bet Amount : </h4>
        <Chip
          sx={{
            color: "secondary",
            fontWeight: "800",
          }}
          label={`${bettingAmount} SUI`}
          color="secondary"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default GameTableInfo;
