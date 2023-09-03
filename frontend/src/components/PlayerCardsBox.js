import React from "react";
import { Box } from "@mui/material";
import Card from "./Card";
import config from "../config.json";

const PlayerCardsBox = ({ playerHandData }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        left: "50vw",
        bottom: "15vh",
        marginX: "auto",
        width: "1200px",
        height: "200px",
        transform: "translateX(-600px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {playerHandData.cards.map((c, i) => (
        <Card
          key={i}
          index={i}
          open={true}
          type={config.CARD_TYPES[Math.floor(c.card_number / 13)]}
          num={config.CARD_NUMS[c.card_number % 13]}
        />
      ))}
    </Box>
  );
};

export default PlayerCardsBox;
