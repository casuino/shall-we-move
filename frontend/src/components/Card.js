import { Box } from "@mui/material";
import card from "../images/cards/card.png";

const Card = ({ index = 0, open = false, type = "heart", num = "2" }) => {
  return (
    <Box
      sx={{
        width: "60px",
        height: "90px",
        position: `${open ? "relative" : "absolute"}`,
        transform: `${
          open
            ? `rotateY(180deg)`
            : `translateX(${6 * index}px) translateY(${-120 - 3 * index}px)`
        }`,
        transformStyle: "preserve-3d",
        transformOrigin: "center",
        transition: "transform .3s",
        "&:hover": {
          transform: `${
            open
              ? `rotateY(180deg) scale(1.1)`
              : `translateX(${6 * index}px) translateY(${
                  -120 - 3 * index
                }px) scale(1.1)`
          }`,
        },
      }}
    >
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
          cursor: "pointer",
          backfaceVisibility: "hidden",
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
          background: `url('/img/cards/${type}/${num}.png')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transform: `rotateY(180deg)`,
          cursor: "pointer",
          backfaceVisibility: "hidden",
        }}
      />
    </Box>
  );
};

export default Card;
