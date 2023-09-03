import { Box } from "@mui/material";
import card from "../images/cards/card.png";
import { useState } from "react";

const CandidateCard = ({
  index = 0,
  type = "heart",
  num = "2",
  handleHit,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const handleOpen = () => {
    if (!loading) {
      handleHit();
      setOpen(true);

      setTimeout(() => {
        setHide(true);
      }, 1500);
    }
  };

  return (
    <Box
      onClick={handleOpen}
      sx={{
        width: "60px",
        height: "90px",
        position: "absolute",
        transform: `${
          open
            ? `translateX(-12vw) translateY(20vh) rotateY(180deg)`
            : `translateX(${-8 * index}px) translateY(${3 * index}px)`
        }`,
        transformStyle: "preserve-3d",
        transformOrigin: "center",
        transition: "all .3s",
        "&:hover": {
          transform: `${
            open
              ? `translateX(-12vw) translateY(20vh) rotateY(180deg) scale(1.1)`
              : `translateX(${-8 * index}px) translateY(${
                  3 * index
                }px) scale(1.1)`
          }`,
        },
      }}
    >
      <Box
        sx={{
          opacity: `${hide && "0"}`,
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
          transition: "all .3s",
        }}
      />

      <Box
        sx={{
          opacity: `${hide && "0"}`,
          zIndex: "5",
          width: "100%",
          height: "100%",
          position: "absolute",
          left: "0",
          top: "0",
          // background: `url('/img/cards/${type}/${num}.png')`,
          backgroundImage: `url(${card})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transform: `rotateY(180deg)`,
          cursor: "pointer",
          backfaceVisibility: "hidden",
          transition: "all .3s",
        }}
      />
    </Box>
  );
};

export default CandidateCard;
