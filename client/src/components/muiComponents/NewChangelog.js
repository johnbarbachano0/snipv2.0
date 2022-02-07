import React, { useContext, useState, useEffect } from "react";
import { themeContext } from "./ThemeContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { patchChangelog, postNewChangelog } from "../../api/api";
import { addNewChangelogSchema } from "../../schema/addNewChangelogSchema";
import {
  Box,
  Button,
  Grid,
  Modal,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Capitalize, DateTimeConverter } from "../MiscJavascript";
import useCountdown from "../useCountdown";
import { useSelector } from "react-redux";

const styles = {
  container: {
    border: "1px solid #fff",
    borderRadius: 1,
    padding: 1,
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
    padding: 1,
  },
  button: {
    marginLeft: 1,
    marginRight: 1,
  },
  span: {
    color: "red",
  },
};

function NewChangelog({ type, openModal, onAdd, onCancel, defaultVal }) {
  const [isFirstRun, setIsFirstRun] = useState(true);
  const { isMobile } = useContext(themeContext);
  const userObj = JSON.parse(sessionStorage.user);
  const { maintenance } = useSelector((state) => state.maintenance.value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DocumentStatus = [...maintenance].pop().DocumentStatus;
  const [cancelEl, setCancelEl] = useState("Cancel");
  const [currFieldVal, setCurrFieldVal] = useState({
    ...defaultVal,
    UserId: userObj.id,
  });
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    resolver: yupResolver(addNewChangelogSchema),
    defaultValues: {
      title: "",
      changelog: "",
      DocumentStatusId: 1,
      ...defaultVal,
    },
  });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useCountdown(0);

  useEffect(() => {
    setIsFirstRun(false);
  }, []);

  useEffect(() => {
    !isFirstRun &&
      localStorage.setItem(
        "changelogData",
        JSON.stringify({ ...currFieldVal, autoSavedDate: Date.now() })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currFieldVal]);

  useEffect(() => {
    countdown === 0 && setCancelEl("Cancel");
  }, [countdown]);

  const handleConfirmCancel = () => {
    if (cancelEl === "Cancel" && isDirty) {
      setCancelEl("Confirm?");
      setCountdown(10);
    } else {
      localStorage.removeItem("changelogData");
      handleClose();
    }
  };

  const onSubmit = (data) => {
    const newData = { ...data, UserId: userObj.id, DocumentStatusId: 2 };
    setLoading(true);
    const submitAction =
      type === "new" ? postNewChangelog(newData) : patchChangelog(newData);
    submitAction.then((res) => {
      setLoading(false);
      localStorage.removeItem("changelogData");
      if (res) {
        onAdd("success", "Added new changelog successfully!");
      } else {
        onAdd("error", "Error during save. Try again.");
      }
    });
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    localStorage.removeItem("changelogData");
    onCancel();
  };

  const handleStatus = (value) => {
    const newStatus = DocumentStatus.filter((status) => {
      if (status.id === value) {
        return status.description;
      } else {
        return null;
      }
    }).pop();
    return Capitalize(newStatus.description);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValue(id, value, { shouldDirty: true });
    setCurrFieldVal((prev) => ({ ...prev, [id]: value }));
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
        <Paper sx={{ ...styles.container }}>
          <Grid item>
            <Typography variant="h5">
              {type === "new" ? "Add New" : "Edit"} Changelog
            </Typography>
          </Grid>
          <Grid item sx={styles.gridItem}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box sx={{ flex: 5 }}>
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
                      inputProps={{ maxLength: 50 }}
                      InputProps={{ style: { fontSize: 14 } }}
                      error={errors.title ? true : false}
                    />
                  )}
                />
                {errors.title && (
                  <Typography
                    color="error"
                    textAlign="left"
                    fontSize={14}
                    sx={{ flex: 5 }}
                  >
                    &#x26A0;{errors.title.message}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="DocumentStatusId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      value={handleStatus(value)}
                      onChange={onChange}
                      variant="standard"
                      placeholder="Status..."
                      autoFocus
                      autoComplete="off"
                      fullWidth={true}
                      inputProps={{
                        disabled: true,
                        style: { textAlign: "center" },
                      }}
                      InputProps={{
                        style: { fontSize: 14 },
                      }}
                      error={errors.DocumentStatusId ? true : false}
                      sx={{ marginLeft: 1 }}
                    />
                  )}
                />
                {errors.DocumentStatusId && (
                  <Typography color="error" textAlign="left" fontSize={14}>
                    &#x26A0;{errors.DocumentStatusId.message}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item sx={styles.gridItem}>
            <Controller
              name="changelog"
              control={control}
              render={({ field: { value } }) => (
                <TextField
                  id="changelog"
                  value={value}
                  onChange={handleChange}
                  multiline
                  rows={isMobile ? 15 : 10}
                  placeholder="Enter change to track here..."
                  required
                  inputProps={{
                    maxLength: 1000,
                  }}
                  fullWidth={true}
                  InputProps={{ style: { fontSize: 14 } }}
                  error={errors.changelog ? true : false}
                />
              )}
            />
            {defaultVal?.autoSavedDate && (
              <Typography color="error" textAlign="left" fontSize={14}>
                Unsubmitted data autosaved on{" "}
                {DateTimeConverter(defaultVal.autoSavedDate)}. Click on cancel
                to disregard.
              </Typography>
            )}
            {errors.changelog && (
              <Typography color="error" textAlign="left" fontSize={14}>
                &#x26A0;{errors.changelog.message}
              </Typography>
            )}
          </Grid>
          <Grid item sx={styles.gridItem}>
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

export default NewChangelog;
