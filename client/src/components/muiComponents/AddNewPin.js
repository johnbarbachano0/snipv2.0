import React, { useContext, useState, useEffect, useRef } from "react";
import { themeContext } from "./ThemeContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postNewPin } from "../../api/api";
import { addNewPinSchema } from "../../schema/addNewPinSchema";
import {
  Button,
  Modal,
  Typography,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  newPinContainer: {
    border: "1px solid #fff",
    borderRadius: 5,
    padding: 20,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    maxWidth: "80vw",
  },
  gridItem: {
    padding: 5,
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
  },
  span: {
    color: "red",
  },
});

function AddNewPin({ openModal, onAddNewPin, onAddNewCancel }) {
  const classes = useStyles();
  const { isMobile } = useContext(themeContext);
  const userObj = JSON.parse(sessionStorage.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewPinSchema),
  });
  const submitEl = useRef(null);
  const cancelEl = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = window.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
  }, []);

  function handleKeyPress(event) {
    event.key === "Enter" && submitEl?.current?.focus()?.click();
    event.key === "Escape" && cancelEl?.current?.focus()?.click();
  }

  function onSubmit(data) {
    setLoading(true);
    const response = postNewPin(data);
    response.then((res) => {
      if (res) {
        onAddNewPin("success", "Added new pin successfully!");
        setLoading(false);
      } else {
        onAddNewPin("error", "Saving new pin failed.");
        setLoading(false);
      }
    });
  }

  return (
    <Modal open={openModal} onClose={onAddNewCancel}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        textAlign="center"
        spacing={2}
      >
        <Paper className={classes.newPinContainer}>
          <Grid item>
            <Typography variant="h5">Add New Pin</Typography>
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              variant="standard"
              name="title"
              {...register("title")}
              placeholder="Title..."
              required
              autoFocus
              autoComplete="off"
              fullWidth={true}
              inputProps={{
                maxLength: 100,
              }}
              InputProps={{ style: { fontSize: 14 } }}
              error={errors.title ? true : false}
            />
            {errors.title && (
              <Typography color="error" textAlign="left" fontSize={14}>
                &#x26A0;{errors.title.message}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              name="description"
              {...register("description")}
              multiline
              rows={isMobile ? 5 : 10}
              placeholder="Enter notes here..."
              inputProps={{
                maxLength: 2000,
              }}
              fullWidth={true}
              InputProps={{ style: { fontSize: 14 } }}
              error={errors.description ? true : false}
            />
            {errors.description && (
              <Typography color="error" textAlign="left" fontSize={14}>
                &#x26A0;{errors.description.message}
              </Typography>
            )}
          </Grid>

          <input
            name="UserId"
            {...register("UserId")}
            placeholder="UserId..."
            value={userObj.id}
            type="hidden"
          />

          <Grid item className={classes.gridItem}>
            <LoadingButton
              id="submitBtn"
              name="submitBtn"
              onClick={handleSubmit(onSubmit)}
              color="primary"
              loading={loading}
              variant="contained"
              sx={{ margin: 1 }}
              ref={submitEl}
            >
              Submit
            </LoadingButton>
            <Button
              variant="contained"
              color="nuetral"
              onClick={() => {
                onAddNewCancel();
              }}
              sx={{ margin: 1 }}
              ref={cancelEl}
            >
              Cancel
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Modal>
  );
}

export default AddNewPin;
