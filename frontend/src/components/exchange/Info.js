import React from "react";
import { Box, Button } from "@mui/material";

export const Info = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        width: "45vw",
        minWidth: "650px",
        backgroundColor: "#1F2032",
        borderTopLeftRadius: "30px",
        borderBottomLeftRadius: "30px",
      }}
    >
      <Box
        sx={{
          fontSize: 48,
          fontWeight: "bold",
          marginLeft: 4,
          lineHeight: 1.2,
          marginBottom: 6,
        }}
      >
        Play decentralized <br /> casino game here on Casuino!
      </Box>
      <Box
        sx={{
          fontSize: 18,
          color: "grey",
          width: 600,
          marginBottom: 10,
        }}
      >
        Welcome to Casuino, the platform where you can play your favorite casino
        games in a decentralized way! With our unique approach, you'll
        experience a level of fairness and security that traditional casinos
        can't match. Our games are built on blockchain technology, which means
        that they are transparent, tamper-proof, and provably fair.
      </Box>
      <Box>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: 200, height: 50, marginRight: 10 }}
        >
          Play Now
        </Button>
        <Button
          variant="outlined"
          sx={{
            width: 200,
            height: 50,
            borderRadius: "30px",
            color: "white",
            borderColor: "white",
          }}
        >
          Read Documentation
        </Button>
      </Box>
    </Box>
  );
};
