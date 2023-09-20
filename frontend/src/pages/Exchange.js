import React from "react";
import { PropTypes } from "prop-types";
import { Box, Grid, Tab, Tabs, Typography, Button } from "@mui/material";
import Buy from "../components/exchange/Buy";
import Sell from "../components/exchange/Sell";
import { Info } from "../components/exchange/Info";
import cashierBackground from "../images/cashier.png";

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
        flexWrap: "wrap",
        backgroundImage: `url(${cashierBackground})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* <Info /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "45vw",
          minWidth: "650px",
          borderRadius: "30px",
          boxShadow: 6,
          backgroundColor: "brown",
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
              label="Stake"
              {...a11yProps(0)}
              sx={{ fontSize: 24, fontWeight: "bold" }}
            />
            <Tab
              label="Unstake"
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
    </Box>
  );
};

export default Exchange;
