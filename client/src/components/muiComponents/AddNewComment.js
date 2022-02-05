import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { postCommentByPinId } from "../../api/api";
import { addNewCommentSchema } from "../../schema/addNewCommentSchema";
import useCountdown from "../useCountdown";

function AddNewComment({ setDisplayAddNew, setUpdated, onAlert }) {
  const userObj = JSON.parse(sessionStorage.user);
  const [countdown, setCountdown] = useCountdown(0);
  const [cancel, setCancel] = useState("Cancel");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const cancelEl = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(addNewCommentSchema),
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
    event.key === "Escape" && setDisplayAddNew();
  }

  function onSubmit(data) {
    setLoading(true);
    postCommentByPinId({
      ...data,
      UserId: userObj.id,
      PinId: id,
    }).then((isSuccess) => {
      if (isSuccess) {
        setDisplayAddNew();
        setUpdated();
        onAlert("success", "New comment added.");
        setLoading(false);
      } else {
        onAlert("error", "Saving comment has failed");
        setLoading(false);
      }
    });
  }

  const handleConfirmCancel = () => {
    if (cancel === "Cancel" && isDirty) {
      setCancel("Confirm?");
      setCountdown(10);
    } else {
      setDisplayAddNew();
    }
  };

  return (
    <Card sx={{ marginTop: 1 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#adf" }}>
            <Typography variant="h5">
              {userObj?.name?.length > 0
                ? userObj?.name?.charAt(0)?.toUpperCase()
                : userObj?.username?.charAt(0)?.toUpperCase()}
            </Typography>
          </Avatar>
        }
        title={
          <Typography variant="h7" fontWeight={600}>
            Add New Comment
          </Typography>
        }
        subheader={
          userObj?.name?.length > 0 ? userObj?.name : `@${userObj?.username}`
        }
        sx={{ paddingTop: 1, paddingBottom: 1 }}
      />
      <CardContent
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
          maxHeight: 75,
          overflowY: "auto",
        }}
      >
        <Controller
          name="commentBody"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="standard"
              onChange={onChange}
              placeholder="Enter comments here..."
              autoComplete="off"
              fullWidth={true}
              inputProps={{ maxLength: 250 }}
              InputProps={{ style: { fontSize: 14 } }}
              multiline
              size="small"
              required
              autoFocus
              error={errors.commentBody ? true : false}
            />
          )}
        />
        {errors.commentBody && (
          <Typography color="error" textAlign="left" fontSize={14}>
            &#x26A0;{errors.commentBody.message}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          color="primary"
          loading={loading}
          variant="contained"
          size="small"
          sx={{ marginRight: 1, marginLeft: 1 }}
        >
          Submit
        </LoadingButton>
        <Button
          disabled={loading}
          variant="contained"
          color="nuetral"
          onClick={handleConfirmCancel}
          size="small"
          ref={cancelEl}
        >
          {cancel} {cancel !== "Cancel" && `(${countdown})`}
        </Button>
      </CardActions>
    </Card>
  );
}

export default AddNewComment;
