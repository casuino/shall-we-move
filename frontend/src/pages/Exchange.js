import React from "react";
import { PropTypes } from "prop-types";
import { Box, Grid, Tab, Tabs, Typography, Button } from "@mui/material";
import Buy from "../components/exchange/Buy";
import Sell from "../components/exchange/Sell";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Exchange = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid
        container
        sx={{
          marginTop: 15,
          width: "90vw",
          height: "70vh",
          boxShadow: 6,
          bgcolor: "#FFF",
          borderRadius: "30px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1F2032",
        }}
      >
        <Grid xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
              width: "45vw",
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
              Welcome to Casuino, the platform where you can play your favorite
              casino games in a decentralized way! With our unique approach,
              you'll experience a level of fairness and security that
              traditional casinos can't match. Our games are built on blockchain
              technology, which means that they are transparent, tamper-proof,
              and provably fair.
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
        </Grid>
        <Grid xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
              width: "45vw",
              backgroundColor: "#232538",
              borderRadius: "30px",
              boxShadow: 6,
            }}
          >
            <Box sx={{ width: "70%" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab
                  label="Buy"
                  {...a11yProps(0)}
                  sx={{ fontSize: 24, fontWeight: "bold" }}
                />
                <Tab
                  label="Sell"
                  {...a11yProps(1)}
                  sx={{ fontSize: 24, fontWeight: "bold" }}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Buy />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Sell />
            </CustomTabPanel>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Exchange;
