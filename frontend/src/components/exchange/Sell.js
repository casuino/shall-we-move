import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import sui from "../../images/coins/sui.png";
import suiCoin from "../../images/coins/suicoin.png";

const Sell = () => {
  const [number, setNumber] = useState(0);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue) && inputValue.length <= 7) {
      setNumber(inputValue);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 5,
        height: "50vh",
        width: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#27293D",
          borderRadius: "30px",
          width: "100%",
          height: "30%",
          marginBottom: 4,
          display: "flex",
          flesxDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            height: "75%",
            width: "8px",
            backgroundColor: "#4BCEAC",
            borderRadius: "8px",
            position: "absolute",
            left: 30,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 60,
          }}
        >
          <Typography sx={{ color: "grey", fontWeight: "bold", marginTop: 1 }}>
            From
          </Typography>
          <TextField
            value={number}
            onChange={handleInputChange}
            type="number"
            sx={{
              marginLeft: -1.5,
              marginTop: -2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: 36,
                "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
                "-moz-appearance": "textfield",
              },
            }}
            InputProps={{
              disableUnderline: true, // Removes the underline
              inputProps: {
                pattern: "[0-9]*", // Allow only numbers
                inputMode: "numeric", // Mobile keyboard should be numeric
              },
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            left: 260,
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              backgroundImage: `url(${suiCoin})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              marginRight: 2,
            }}
          />
          <Typography sx={{ fontSize: 18 }}>SUICOIN</Typography>
        </Box>
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <ArrowDownwardIcon />
      </Box>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#27293D",
          borderRadius: "30px",
          width: "100%",
          height: "30%",
          marginBottom: 4,
          display: "flex",
          flesxDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            height: "75%",
            width: "8px",
            backgroundColor: "#4BCEAC",
            borderRadius: "8px",
            position: "absolute",
            left: 30,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 60,
          }}
        >
          <Typography sx={{ color: "grey", fontWeight: "bold" }}>To</Typography>
          <Box sx={{ fontSize: 36, maxWidth: 200 }}>{number}</Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            left: 260,
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              backgroundImage: `url(${sui})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              marginRight: 2,
            }}
          />
          <Typography sx={{ fontSize: 18 }}>SUI</Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        sx={{ width: "100%", height: "15%", fontSize: 16, fontWeight: "bold" }}
      >
        Unstake Now
      </Button>
    </Box>
  );
};

export default Sell;
