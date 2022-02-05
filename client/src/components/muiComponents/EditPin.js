import React, { useContext, useState, useEffect, useRef } from "react";
import { themeContext } from "./ThemeContext";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { patchPin } from "../../api/api";
import { addNewPinSchema } from "../../schema/addNewPinSchema";
import useCountdown from "../useCountdown";

function EditPin({ pin, setModal, onAlert, setUpdated }) {
  const { isMobile } = useContext(themeContext);
  const [loading, setLoading] = useState(false);
  const cancelEl = useRef(null);
  const [countdown, setCountdown] = useCountdown(0);
  const [cancel, setCancel] = useState("Cancel");
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    resolver: yupResolver(addNewPinSchema),
    defaultValues: pin,
  });

  useEffect(() => {
    const unsubscribe = document.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    countdown === 0 && setCancel("Cancel");
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [countdown]);

  function handleKeyPress(event) {
    event.key === "Escape" && setModal();
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValue(id, value, { shouldDirty: true });
  };

  function onSubmit(data) {
    setLoading(true);
    isDirty &&
      patchPin(data).then((res) => {
        if (res) {
          onAlert("success", "Updated pin successfully!");
          setModal();
          setUpdated();
          setLoading(false);
        } else {
          onAlert("error", "Pin update has failed.");
          setLoading(false);
        }
      });
    !isDirty &&
      (() => {
        onAlert("info", "No changes made!");
        setModal();
        setUpdated();
        setLoading(false);
      })();
  }

  const handleConfirmCancel = () => {
    if (cancel === "Cancel" && isDirty) {
      setCancel("Confirm?");
      setCountdown(10);
    } else {
      setModal();
    }
  };

  return (
    <Grid container>
      <Paper variant="outlined" sx={{ width: "100%", padding: 1 }}>
        <Grid item>
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
        <Grid item>
          <Controller
            name="description"
            control={control}
            render={({ field: { value } }) => (
              <TextField
                id="description"
                value={value}
                onChange={handleChange}
                multiline
                rows={isMobile ? 10 : 15}
                placeholder="Enter notes here..."
                required
                inputProps={{ maxLength: 2000 }}
                fullWidth={true}
                InputProps={{ style: { fontSize: 14 } }}
                error={errors.description ? true : false}
                sx={{ marginTop: 0.5 }}
              />
            )}
          />
          {errors.description && (
            <Typography color="error" textAlign="left" fontSize={14}>
              &#x26A0;{errors.description.message}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <Grid container justifyContent="center">
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              color="primary"
              loading={loading}
              variant="contained"
              sx={{ minWidth: "25%", margin: 1 }}
            >
              Save
            </LoadingButton>
            <Button
              disabled={loading}
              onClick={handleConfirmCancel}
              variant="contained"
              color="nuetral"
              sx={{ minWidth: "25%", margin: 1 }}
              ref={cancelEl}
            >
              {cancel} {cancel !== "Cancel" && `(${countdown})`}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default EditPin;
