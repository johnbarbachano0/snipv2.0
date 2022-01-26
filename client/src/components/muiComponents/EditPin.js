import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { patchPin } from "../../api/api";
import { addNewPinSchema } from "../../schema/addNewPinSchema";

function EditPin({ pin, setModal, onAlert, setUpdated }) {
  const [values, setVal] = useState([
    { title: pin.title },
    { description: pin.description },
  ]);
  const [loading, setLoading] = useState(false);
  const submitEl = useRef(null);
  const cancelEl = useRef(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(addNewPinSchema),
  });

  useEffect(() => {
    const unsubscribe = document.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyPress(event) {
    event.key === "Enter" && submitEl?.current?.focus()?.click();
    event.key === "Escape" && setModal();
  }

  function handleChange(e) {
    var { name, value } = e.target;
    setVal((prevVal) => {
      const filtered = prevVal.filter((value) => !value[name]);
      return [...filtered, { [name]: value }];
    });
  }

  function getValue(name) {
    const key = name;
    const results = values.filter((value) => value[key]);
    if (results.length === 0) {
      return "";
    } else {
      return results[0][key];
    }
  }

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

  return (
    <Grid container>
      <Paper variant="outlined" sx={{ width: "100%", padding: 1 }}>
        <Grid item>
          <TextField
            name="title"
            {...register("title")}
            value={getValue("title")}
            placeholder="Enter title here"
            inputProps={{ maxLength: "100" }}
            autoComplete="off"
            fullWidth={true}
            onChange={handleChange}
            error={errors.title ? true : false}
          />
          {errors.title && (
            <Typography color="error" textAlign="left" fontSize={14}>
              &#x26A0;{errors.title.message}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <TextField
            name="description"
            {...register("description")}
            value={getValue("description")}
            multiline
            rows={10}
            placeholder="Enter notes here..."
            inputProps={{
              maxLength: 2000,
            }}
            fullWidth={true}
            sx={{ marginTop: 1 }}
            onChange={handleChange}
            error={errors.description ? true : false}
          />
          {errors.description && (
            <Typography color="error" textAlign="left" fontSize={14}>
              &#x26A0;{errors.description.message}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <input
            type="hidden"
            name="PinId"
            value={pin.id}
            {...register("PinId")}
          />
        </Grid>
        <Grid item>
          <Grid container justifyContent="center">
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              color="primary"
              loading={loading}
              variant="contained"
              sx={{ width: "25%", margin: 1 }}
              ref={submitEl}
            >
              Save
            </LoadingButton>
            <Button
              onClick={() => {
                setModal();
              }}
              variant="contained"
              color="nuetral"
              sx={{ width: "25%", margin: 1 }}
              ref={cancelEl}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default EditPin;
