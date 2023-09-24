import React from "react";
import { Box, Typography } from "@mui/material";
import card from "../images/cards/card.png";
import Card from "./Card";
import {CARD_NUMS, CARD_TYPES} from "../const/_const";

const DealerCardsBox = ({ dealerHandData, isPlaying }) => {
  // console.log(dealerHandData.cards);
  return (
    <Box
      sx={{
        position: "fixed",
        left: "50vw",
        top: "30vh",
        width: "200px",
        height: "200px",
        transform: "translateX(-100px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {dealerHandData.cards.map((c, i) =>
        c.card_number < 10000 ? (
          <Card
            key={i}
            index={i}
            open={true}
            type={CARD_TYPES[Math.floor(c.card_number / 13)]}
            num={CARD_NUMS[c.card_number % 13]}
          />
        ) : (
          <Card
            key={i}
            index={i}
            type={CARD_TYPES[Math.floor(c.card_number / 13)]}
            num={CARD_NUMS[c.card_number % 13]}
          />
        )
      )}
    </Box>
  );
};

export default DealerCardsBox;
