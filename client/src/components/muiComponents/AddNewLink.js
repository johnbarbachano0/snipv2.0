import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postNewLink } from "../../api/api";
import { addNewLinkSchema } from "../../schema/addNewLinkSchema";
import {
  Button,
  Modal,
  Typography,
  TextField,
  Grid,
  Paper,
  Select,
  OutlinedInput,
  Box,
  Chip,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { makeStyles } from "@mui/styles";
import { getIcon } from "../MiscJavascript";

const useStyles = makeStyles({
  newContainer: {
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

const tags = [
  "API",
  "Backend",
  "Frontend",
  "CSS",
  "HTML",
  "Javascript",
  "NodeJS",
  "React",
  "Mobile",
  "Web",
];

function AddNewLink({ openModal, onAddNewLink, onAddNewCancel }) {
  const classes = useStyles();
  const userObj = JSON.parse(sessionStorage.user);
  const submitEl = useRef(null);
  const cancelEl = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewLinkSchema),
  });
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState([]);

  useEffect(() => {
    const unsubscribe = document.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
  }, []);

  function handleKeyPress(event) {
    event.key === "Enter" && submitEl?.current?.focus()?.click();
    event.key === "Escape" && cancelEl?.current?.focus()?.click();
  }

  function handleChange(event) {
    const { value } = event.target;
    setTag(value);
  }

  function onSubmit(data) {
    setLoading(true);
    postNewLink(data).then((res) => {
      if (res) {
        onAddNewLink("success", "Added new link successfully!");
        setLoading(false);
      } else {
        onAddNewLink("error", "Saving new link failed.");
        setLoading(false);
      }
    });
  }

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    onAddNewCancel();
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
        <Paper className={classes.newContainer}>
          <Grid item>
            <Typography variant="h5">Add New Link</Typography>
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
              variant="standard"
              name="siteUrl"
              {...register("siteUrl")}
              placeholder="Website (https only)..."
              required
              autoComplete="off"
              fullWidth={true}
              inputProps={{
                maxLength: 255,
              }}
              InputProps={{ style: { fontSize: 14 } }}
              error={errors.siteUrl ? true : false}
            />
            {errors.siteUrl && (
              <Typography color="error" textAlign="left" fontSize={14}>
                &#x26A0;{errors.siteUrl.message}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              variant="standard"
              name="description"
              {...register("description")}
              placeholder="Site description..."
              required
              autoComplete="off"
              fullWidth={true}
              inputProps={{
                maxLength: 255,
              }}
              InputProps={{ style: { fontSize: 14 } }}
              error={errors.description ? true : false}
            />
            {errors.description && (
              <Typography color="error" textAlign="left" fontSize={14}>
                &#x26A0;{errors.description.message}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.gridItem}>
            <Select
              name="tag"
              {...register("tags")}
              value={tag}
              onChange={handleChange}
              multiple
              displayEmpty
              fullWidth={true}
              placeholder="tags..."
              label="Tags"
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.length === 0 ? (
                    <em>Select tags...</em>
                  ) : (
                    selected.map((value) => {
                      return (
                        <Chip key={value} label={value} icon={getIcon(value)} />
                      );
                    })
                  )}
                </Box>
              )}
            >
              <MenuItem disabled={true}>
                <em>Tags</em>
              </MenuItem>
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {getIcon(tag)}
                  {tag}
                </MenuItem>
              ))}
            </Select>
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
              onClick={() => onAddNewCancel()}
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

export default AddNewLink;
