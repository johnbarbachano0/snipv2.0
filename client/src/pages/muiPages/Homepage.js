import React, { useState, useEffect } from "react";
import NavBar from "../../components/muiComponents/NavBar";
import CardBody from "../../components/muiComponents/CardBody";
import AddNewPin from "../../components/muiComponents/AddNewPin";
import Alerts from "../../components/muiComponents/Alerts";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import { getSearchPins } from "../../api/api";
import { Box, Grid } from "@mui/material";
import PinSkeleton from "../../components/muiComponents/PinSkeleton";

function Homepage() {
  const page = "home";
  const [loading, setLoading] = useState(true);
  const [listOfPins, setListOfPins] = useState("");
  const [showAddNewPin, setAddNewPin] = useState(false);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  useEffect(() => {
    handleSearch("");
    sessionStorage.alert &&
      (() => {
        const deletePinAlert = JSON.parse(sessionStorage.alert);
        const { type, message } = deletePinAlert;
        handleAlert(type, message);
        sessionStorage.removeItem("alert");
      })();
  }, [isUpdated]); // eslint-disable-line

  function handleSearch(searchVal) {
    setLoading(true);
    getSearchPins(searchVal)
      .then((pins) => {
        setListOfPins(pins);
        handleAlert("success", `Displaying ${pins.length} result/s.`);
        setLoading(false);
      })
      .catch((error) => {
        handleAlert("error", "Getting pins failed.");
        setLoading(false);
      });
  }

  function handleAddNewPin(type, message) {
    handleAlert(type, message);
    setIsUpdated(!isUpdated);
    setAddNewPin(false);
  }

  function handleAlert(type, message) {
    setAlert({ type, message });
    setShowAlert(true);
  }

  return (
    <>
      <NavBar
        page={page}
        isLoading={loading}
        onAdd={() => setAddNewPin(true)}
        onSearch={(searchVal) => handleSearch(searchVal)}
        addLabel={"Add New Pin"}
      />
      {loading && <PinSkeleton />}
      {!loading && listOfPins.length > 0 && (
        <Box margin={2} marginTop={8}>
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="stretch"
            spacing={2}
          >
            {listOfPins &&
              listOfPins.map((pin) => {
                return (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={pin.id}>
                    <CardBody
                      id={pin.id}
                      title={pin.title}
                      desc={pin.description}
                      username={pin.User.username}
                      name={pin.User.name}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      )}
      {showAlert && (
        <Alerts
          type={alert.type}
          message={alert.message}
          closeAlert={() => setShowAlert(false)}
        />
      )}
      {showAddNewPin && (
        <AddNewPin
          onAddNewCancel={() => setAddNewPin(false)}
          onAddNewPin={(type, message) => handleAddNewPin(type, message)}
          openModal={showAddNewPin}
        />
      )}
      <ScrollToTop />
    </>
  );
}

export default Homepage;
