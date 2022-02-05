import React from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { DateTimeConverter } from "../MiscJavascript";
import Loading from "../Loading";
import AddNewComment from "../muiComponents/AddNewComment";

function Comment({
  comments,
  isGetComment,
  setUpdated,
  onAlert,
  showAddNew,
  setShowAddNew,
}) {
  return (
    <Grid container>
      <Paper variant="outlined" sx={{ width: "100%", padding: 1 }}>
        <Grid item>
          <Typography variant="h6" align="center">
            Comments Section
          </Typography>
        </Grid>
        {showAddNew && (
          <Grid item>
            <AddNewComment
              setDisplayAddNew={() => setShowAddNew()}
              setUpdated={() => {
                setUpdated();
              }}
              onAlert={(type, message) => onAlert(type, message)}
            />
          </Grid>
        )}

        {comments &&
          !isGetComment &&
          comments.map((comment) => {
            return (
              <Grid item key={comment.id} sx={{ marginTop: 1 }}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#adf" }}>
                        <Typography variant="h5">
                          {comment?.User?.name?.length > 0
                            ? comment.User.name.charAt(0).toUpperCase()
                            : comment.User.username.charAt(0).toUpperCase()}
                        </Typography>
                      </Avatar>
                    }
                    title={
                      <Typography variant="h7" fontWeight={600}>
                        {comment?.User?.name?.length > 0
                          ? comment.User.name
                          : `@${comment.User.username}`}
                      </Typography>
                    }
                    subheader={DateTimeConverter(comment.updatedAt)}
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
                    <Typography
                      variant="body2"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {comment.commentBody}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

        {comments.length === 0 && !isGetComment && !showAddNew && (
          <Grid item sx={{ marginTop: 0.5 }}>
            <Card>
              <CardContent sx={{ padding: 2 }}>
                <Typography variant="body2">
                  No comments for this pin yet...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Paper>

      {isGetComment && (
        <Loading type="cylon" color="#1DB9C3" height="10rem" width="10rem" />
      )}
    </Grid>
  );
}

export default Comment;
