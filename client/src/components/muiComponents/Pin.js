import React, { useState } from "react";
import { Button, Card, Grid, Paper, Typography } from "@mui/material";
import { DateTimeConverter } from "../MiscJavascript";
import { deletePinById } from "../../api/api";
import { useHistory } from "react-router";
import ConfirmModal from "./ConfirmModal";
import EditPin from "./EditPin";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  pinContent: {
    padding: 8,
  },
  pinDescription: {
    "& span": { fontWeight: "bold" },
    "& button": { margin: 10, width: "25%" },
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 4,
  },
});

function Pin({ pin, onAlert, setUpdated }) {
  const classes = useStyles();
  const userObj = JSON.parse(sessionStorage.user);
  const isAdmin = userObj.role === "Admin";
  const [showModal, setModal] = useState(false);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  function handleDeleteYes() {
    deletePinById(pin.id).then((res) => {
      if (res) {
        const alertMsg = {
          type: "success",
          message: "Pin deleted successfully!",
        };
        sessionStorage.setItem("alert", JSON.stringify(alertMsg));
        history.push("/");
      } else {
        onAlert("error", "Pin deletion has failed.");
        setModal();
      }
    });
  }

  return (
    <Grid container direction="column">
      <Paper variant="outlined" className={classes.pinContent}>
        {showModal === "edit" && (
          <Typography variant="h6" align="center">
            Edit Pin
          </Typography>
        )}
        {(!showModal || showModal === "delete") && (
          <Typography variant="h6" align="center">
            {pin.title}
          </Typography>
        )}
        {showModal === "edit" && (
          <EditPin
            pin={pin}
            setModal={() => setModal()}
            onAlert={(type, msg) => {
              onAlert(type, msg);
            }}
            setUpdated={() => {
              setUpdated();
            }}
          />
        )}
        {(!showModal || showModal === "delete") && (
          <Card className={classes.pinDescription}>
            <Typography
              variant="body2"
              style={{
                whiteSpace: "pre-line",
                paddingTop: 20,
                paddingBottom: 20,
              }}
            >
              {pin.description}
            </Typography>
          </Card>
        )}
        <Card className={classes.pinDescription}>
          <Typography variant="body1" align="center" style={{ paddingTop: 5 }}>
            <span>Details</span>
          </Typography>
          <Typography variant="body2" align="left">
            <span>Pin Id: </span>
            {pin.id}
          </Typography>
          <Typography variant="body2" align="left">
            <span>Created By: </span>
            {pin?.User?.name?.length > 0
              ? pin.User.name
              : `@${pin.User.username}`}
          </Typography>
          <Typography variant="body2" align="left">
            <span>Date Created: </span>
            {DateTimeConverter(pin.createdAt)}
          </Typography>
          <Typography variant="body2" align="left">
            <span>Date Updated: </span>
            {DateTimeConverter(pin.updatedAt)}
          </Typography>

          {!showModal && (userObj.id === pin.UserId || isAdmin) && (
            <Grid container direction="row" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setModal("edit");
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => {
                  setModal("delete");
                }}
              >
                Delete
              </Button>
            </Grid>
          )}

          {showModal === "delete" && (
            <ConfirmModal
              action="Confirm delete?"
              onClickCancel={() => {
                setModal();
              }}
              onClickYes={() => {
                handleDeleteYes();
                setLoading(true);
              }}
              confirmLoading={loading}
              openModal={showModal === "delete" ? true : false}
            />
          )}
        </Card>
      </Paper>
    </Grid>
  );
}

export default Pin;
