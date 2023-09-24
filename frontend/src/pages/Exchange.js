import React from "react";
import { PropTypes } from "prop-types";
import {Box, Grid, Tab, Tabs, Typography, Button, CircularProgress} from "@mui/material";
import Buy from "../components/exchange/Buy";
import Sell from "../components/exchange/Sell";
import { Info } from "../components/exchange/Info";
import cashierBackground from "../images/cashier.png";
import {ToastContainer} from "react-toastify";

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
  const [loading, setLoading] = React.useState(false);

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
        {/*loading component*/}
        {loading && (
            <Box
                sx={{
                    position: "fixed",
                    top: "60%",
                    left: "50%",
                    width: "100px",
                    height: "100px",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress color="secondary" />
            </Box>
        )}

        {/*The toast container - toastify*/}
        <ToastContainer
            position="top-center"
            newestOnTop
            pauseOnFocusLoss={false}
        />

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
          <Buy setLoading={setLoading} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Sell setLoading={setLoading} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default Exchange;
