import { Box, Chip, Typography } from "@mui/material";
import {CARD_NUMS} from "../const/_const";

const GameTableScore = ({
  isPlaying,
  dealerHandData,
  dealerTotal,
  playerHandData,
  playerTotal,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid white",
        display: "inline-block",
        padding: "0 20px",
        borderRadius: "20px",
      }}
    >
      <Box
        sx={{
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            padding: "20px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: "0 10px 0 0" }}>Dealer's cards:</h3>
            <ul
              style={{
                display: "flex",
                margin: "0",
                padding: "0",
              }}
            >
              {isPlaying == 2 &&
                dealerHandData.cards.map((card, i) => {
                  if (card.card_number < 10000) {
                    return (
                      <Chip
                        key={i}
                        sx={{ marginRight: "10px", fontWeight: "800" }}
                        label={CARD_NUMS[card.card_number % 13]}
                      />
                    );
                  } else {
                    return (
                      <Chip
                        key={i}
                        sx={{ marginRight: "10px", fontWeight: "800" }}
                        label="hidden"
                      />
                    );
                  }
                })}
            </ul>
          </Box>

          <h3
            style={{
              margin: "0",
              color: dealerTotal > 21 ? "#f44336" : "#4CCEAC",
            }}
          >
            {dealerTotal > 21
              ? `Total: ${dealerTotal} - LOSE! (over 21)`
              : dealerTotal == 21
              ? `Total: ${dealerTotal} - BlackJack!`
              : `Total: ${dealerTotal}`}
          </h3>
        </Box>
      </Box>

      <Box
        sx={{
          marginBottom: "10px",
        }}
      >
        <Box
          sx={{
            borderTop: "1px solid white",
            display: "inline-block",
            padding: "20px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: "0 10px 0 0" }}>Player's cards:</h3>
            <ul
              style={{
                display: "flex",
                margin: "0",
                padding: "0",
              }}
            >
              {isPlaying == 2 &&
                playerHandData.cards.map((card, i) => {
                  if (card.card_number < 10000) {
                    return (
                      <Chip
                        key={i}
                        sx={{ marginRight: "10px", fontWeight: "800" }}
                        label={CARD_NUMS[card.card_number % 13]}
                      />
                    );
                  } else {
                    return (
                      <Typography key={i} sx={{ marginRight: "10px" }}>
                        hidden
                      </Typography>
                    );
                  }
                })}
            </ul>
          </Box>

          <h3
            style={{
              margin: "0",
              color: playerTotal > 21 ? "#f44336" : "#4CCEAC",
            }}
          >
            {playerTotal > 21
              ? `Total: ${playerTotal} - LOSE! (over 21)`
              : playerTotal == 21
              ? `Total: ${playerTotal} - BlackJack!`
              : `Total: ${playerTotal}`}
          </h3>
        </Box>
      </Box>
    </Box>
  );
};

export default GameTableScore;
