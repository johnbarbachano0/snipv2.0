import React, { useEffect, useState } from "react";
import NavBar from "../../components/muiComponents/NavBar";
import {
  Capitalize,
  CapitalizeFirstLetters,
  DateTimeConverter,
} from "../../components/MiscJavascript";
import {
  Box,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { getHelloImage } from "../../components/MiscJavascript";

const common = { fontWeight: "bold" };

function Profile() {
  const page = "profile";
  const userObj = JSON.parse(sessionStorage.user);
  const [loginImage, setLoginImage] = useState("");
  useEffect(() => {
    const image = getHelloImage();
    setLoginImage(image);
  }, []);

  return (
    <>
      <NavBar isLoading={false} page={page} />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          direction: "column",
          justifyContent: "center",
        }}
      >
        <Card sx={{ maxWidth: "70%" }}>
          <CardMedia component="img" height="194" image={loginImage} />
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "red" }}>
                <Typography variant="h5">
                  {userObj.provider === "snip" || userObj.name === null
                    ? userObj.username.charAt(0).toUpperCase()
                    : userObj.name.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
            }
            title={
              <Typography variant="h5">
                {userObj.provider === "snip" || userObj.name === null
                  ? `@${userObj.username}`
                  : CapitalizeFirstLetters(userObj.name)}
              </Typography>
            }
            subheader={
              <Typography>
                <span
                  style={{ ...common, color: userObj.status ? "green" : "red" }}
                >
                  {userObj.status ? "Active" : "Inactive"}
                </span>
              </Typography>
            }
            bgcolor="primary"
          />
          <CardContent>
            <Typography variant="body2">
              <span style={{ ...common }}>Snip Id: </span>
              {userObj.id}
            </Typography>
            <Typography variant="body2">
              <span style={{ ...common }}>Role: </span>
              {userObj.role}
            </Typography>
            <Typography variant="body2">
              <span style={{ ...common }}>Login Provider: </span>
              {Capitalize(userObj.provider)}
            </Typography>
            {userObj?.email && (
              <Typography variant="body2">
                <span style={{ ...common }}>Email: </span>
                {userObj?.email}
              </Typography>
            )}
            {userObj?.username && userObj?.provider === "snip" && (
              <Typography variant="body2">
                <span style={{ ...common }}>Username: </span>
                {userObj?.username}
              </Typography>
            )}
            {userObj?.socialId && userObj?.provider !== "snip" && (
              <Typography variant="body2">
                <span style={{ ...common }}>
                  {Capitalize(userObj.provider)} Id:{" "}
                </span>
                {userObj?.socialId}
              </Typography>
            )}
            <Typography variant="body2">
              <span style={{ ...common }}>Last Login: </span>
              {DateTimeConverter(userObj.lastLogin)}
            </Typography>
            <Typography variant="body2">
              <span style={{ ...common }}>Date Created: </span>
              {DateTimeConverter(userObj.createdAt)}
            </Typography>
            <Typography variant="body2">
              <span style={{ ...common }}>Date Updated: </span>
              {DateTimeConverter(userObj.updatedAt)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default Profile;
