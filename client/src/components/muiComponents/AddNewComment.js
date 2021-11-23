import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { postCommentByPinId } from "../../api/api";
import { addNewCommentSchema } from "../../schema/addNewCommentSchema";

function AddNewComment({ setDisplayAddNew, setUpdated, onAlert }) {
  const userObj = JSON.parse(sessionStorage.user);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewCommentSchema),
  });

  function onSubmit(data) {
    setLoading(true);
    const response = postCommentByPinId(data);
    response.then((isSuccess) => {
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

  return (
    <Card sx={{ marginTop: 1 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#adf" }}>
            <Typography variant="h5">
              {userObj.username.charAt(0).toUpperCase()}
            </Typography>
          </Avatar>
        }
        title={
          <Typography variant="h7" fontWeight={600}>
            Add New Comment
          </Typography>
        }
        subheader={`@${userObj.username}`}
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
        <TextField
          variant="standard"
          name="commentBody"
          {...register("commentBody")}
          placeholder="Enter comments here..."
          autoComplete="off"
          fullWidth={true}
          inputProps={{
            maxLength: 250,
          }}
          InputProps={{ style: { fontSize: 14 } }}
          multiline
          size="small"
          required
          error={errors.commentBody ? true : false}
        />
        {errors.commentBody && (
          <Typography color="error" textAlign="left" fontSize={14}>
            &#x26A0;{errors.commentBody.message}
          </Typography>
        )}
        <input
          name="UserId"
          value={userObj.id}
          {...register("UserId")}
          hidden
        />
        <input name="PinId" value={id} {...register("PinId")} hidden />
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
          variant="contained"
          color="nuetral"
          onClick={() => {
            setDisplayAddNew();
          }}
          size="small"
        >
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
}

export default AddNewComment;
