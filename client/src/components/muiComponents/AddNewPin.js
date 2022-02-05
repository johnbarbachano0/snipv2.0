import React, { useContext, useState, useEffect } from "react";
import { themeContext } from "./ThemeContext";
import { useForm, Controller } from "react-hook-form";
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
import useCountdown from "../useCountdown";

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
    maxWidth: "95vw",
    maxHeight: "95vh",
    overflowY: "auto",
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
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    resolver: yupResolver(addNewPinSchema),
  });
  const [cancelEl, setCancelEl] = useState("Cancel");
  const [countdown, setCountdown] = useCountdown(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    countdown === 0 && setCancelEl("Cancel");
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [countdown]);

  const onSubmit = (data) => {
    setLoading(true);
    postNewPin({ ...data, UserId: userObj.id }).then((res) => {
      res && onAddNewPin("success", "Added new pin successfully!");
      !res && onAddNewPin("error", "Saving new pin failed.");
      setLoading(false);
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValue(id, value, { shouldDirty: true });
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    onAddNewCancel();
  };

  const handleConfirmCancel = () => {
    if (cancelEl === "Cancel" && isDirty) {
      setCancelEl("Click again!");
      setCountdown(10);
    } else {
      handleClose();
    }
  };

  return (
    <Modal open={openModal} onClose={handleClose}>
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
            <Controller
              name="title"
              control={control}
              render={({ field: { value } }) => (
                <TextField
                  id="title"
                  value={value}
                  onChange={handleChange}
                  variant="standard"
                  placeholder="Title..."
                  autoFocus
                  autoComplete="off"
                  fullWidth={true}
                  inputProps={{ maxLength: 100 }}
                  InputProps={{ style: { fontSize: 14 } }}
                  error={errors.title ? true : false}
                />
              )}
            />
            {errors.title && (
              <Typography color="error" textAlign="left" fontSize={14}>
                &#x26A0;{errors.title.message}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.gridItem}>
            <Controller
              name="description"
              control={control}
              render={({ field: { value } }) => (
                <TextField
                  id="description"
                  value={value}
                  onChange={handleChange}
                  multiline
                  rows={isMobile ? 15 : 10}
                  placeholder="Enter notes here..."
                  required
                  inputProps={{
                    maxLength: 2000,
                  }}
                  fullWidth={true}
                  InputProps={{ style: { fontSize: 14 } }}
                  error={errors.description ? true : false}
                />
              )}
            />
            {errors.description && (
              <Typography color="error" textAlign="left" fontSize={14}>
                &#x26A0;{errors.description.message}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.gridItem}>
            <LoadingButton
              id="submitBtn"
              name="submitBtn"
              onClick={handleSubmit(onSubmit)}
              color="primary"
              loading={loading}
              variant="contained"
              sx={{ margin: 1 }}
            >
              Submit
            </LoadingButton>
            <Button
              disabled={loading}
              variant="contained"
              color="nuetral"
              onClick={handleConfirmCancel}
              sx={{ margin: 1 }}
            >
              {cancelEl} {cancelEl !== "Cancel" && `(${countdown})`}
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Modal>
  );
}

export default AddNewPin;
