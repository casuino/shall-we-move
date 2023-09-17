import { useEffect } from "react";
import { Box } from "@mui/material";
import bg_landing from "../images/bg_landing.jpg";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/tutorial");
  }, [navigate]);
  return (
    <Box
      sx={{
        backgroundImage: `url(${bg_landing})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
    ></Box>
  );
};

export default Landing;
