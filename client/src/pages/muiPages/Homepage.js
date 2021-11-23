import React, { useState, useEffect } from "react";
import NavBar from "../../components/muiComponents/NavBar";
import CardBody from "../../components/muiComponents/CardBody";
import AddNewPin from "../../components/muiComponents/AddNewPin";
import Alerts from "../../components/muiComponents/Alerts";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import Loading from "../../components/Loading";
import { getSearchPins } from "../../api/api";
import { Grid, Box } from "@mui/material";

function Homepage() {
  const page = "home";
  const [isLoading, setLoading] = useState(true);
  const [listOfPins, setListOfPins] = useState("");
  const [showAddNewPin, setAddNewPin] = useState(false);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  function handleAlert(type, message) {
    setAlert({ type, message });
    setShowAlert(true);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

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

  useEffect(() => {
    setLoading(true);
    handleSearch("");
    sessionStorage.alert &&
      (() => {
        const deletePinAlert = JSON.parse(sessionStorage.alert);
        const { type, message } = deletePinAlert;
        handleAlert(type, message);
        sessionStorage.removeItem("alert");
      })();
  }, [isUpdated]); // eslint-disable-line

  return (
    <>
      <NavBar
        page={page}
        isLoading={isLoading}
        onAddNewPin={() => {
          setAddNewPin(true);
        }}
        onSearch={(searchVal) => {
          handleSearch(searchVal);
        }}
      />
      <Box margin={5} marginTop={8}>
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
                  />
                </Grid>
              );
            })}
        </Grid>{" "}
      </Box>

      {showAlert && <Alerts type={alert.type} message={alert.message} />}
      {showAddNewPin && (
        <AddNewPin
          onAddNewCancel={() => {
            setAddNewPin(false);
          }}
          onAddNewPin={(type, message) => {
            handleAlert(type, message);
            setIsUpdated(!isUpdated);
            setAddNewPin(false);
          }}
          openModal={showAddNewPin}
        />
      )}
      {isLoading && (
        <div className="center">
          <Loading type="cylon" color="#1DB9C3" height="10rem" width="10rem" />
        </div>
      )}
      <ScrollToTop />
    </>
  );
}

export default Homepage;
