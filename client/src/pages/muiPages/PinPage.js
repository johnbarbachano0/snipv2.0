import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import NavBar from "../../components/muiComponents/NavBar";
import Comment from "../../components/muiComponents/Comment";
import Pin from "../../components/muiComponents/Pin";
import Alerts from "../../components/muiComponents/Alerts";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import Loading from "../../components/Loading";
import { getPinById, getCommentByPinId } from "../../api/api";

function PinPage() {
  const page = "pin";
  const { id } = useParams();
  const [pin, setPin] = useState("");
  const [comments, setComments] = useState("");
  const [isGetComment, setGetComment] = useState(false);
  const [isUpdated, setUpdated] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    setGetComment(true);
    const getPin = getPinById(id);
    getPin
      .then((pin) => setPin(pin))
      .catch((error) => {
        handleAlert("error", "Getting pin failed.");
      });
    const getComment = getCommentByPinId(id);
    getComment
      .then((com) => {
        setComments(com);
        setGetComment(false);
      })
      .catch((error) => {
        handleAlert("error", "Getting comments failed.");
      });
  }, [id, isUpdated]);

  function handleAlert(type, message) {
    setAlert({ type, message });
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  return (
    <>
      <NavBar
        isLoading={false}
        page={page}
        onAdd={() => setShowAddNew(true)}
        addLabel={"Add New Comment"}
      />

      {pin && comments && (
        <Box margin={2} marginTop={8}>
          <Grid container direction="row" justifyContent="center" spacing={1}>
            <Grid item xs={12} md={6}>
              <Pin
                pin={pin}
                onAlert={(type, message) => handleAlert(type, message)}
                setUpdated={() => {
                  setUpdated(!isUpdated);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Comment
                comments={comments}
                isGetComment={isGetComment}
                setUpdated={() => {
                  setUpdated(!isUpdated);
                }}
                onAlert={(type, message) => handleAlert(type, message)}
                showAddNew={showAddNew}
                setShowAddNew={() => {
                  setShowAddNew(!setShowAddNew);
                }}
              />
            </Grid>
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
      {!pin && !comments && (
        <Loading type="bubbles" color="#1DB9C3" height="10rem" width="10rem" />
      )}
      <ScrollToTop />
    </>
  );
}

export default PinPage;
