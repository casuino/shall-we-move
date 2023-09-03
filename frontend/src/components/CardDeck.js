import React from "react";
import { Box } from "@mui/material";
import CandidateCard from "./CandidateCard";

const CardDeck = ({ cardDeckData, handleHit, loading }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        right: "5vw",
        top: "35vh",
        width: "200px",
        height: "200px",
        transform: "translateX(-100px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingRight: "15px",
      }}
    >
      {cardDeckData.cards.map((c, i) => (
        <CandidateCard
          key={i}
          index={i}
          handleHit={handleHit}
          loading={loading}
        />
      ))}
    </Box>
  );
};

export default CardDeck;
