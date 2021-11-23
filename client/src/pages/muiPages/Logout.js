import React, { useEffect, useState } from "react";
import { logoutUser } from "../../api/api";
import { getLogoutImage } from "../../components/MiscJavascript";
import { Box, Fab, Paper, Tooltip, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

function Logout() {
  const [logoutImage, setLogoutImage] = useState("");
  const history = useHistory();
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const image = getLogoutImage();
    setLogoutImage(image);
    logoutUser();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    timer === -1 && history.push("/login");
    const timerOut = setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
    return () => {
      clearTimeout(timerOut);
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [timer]);

  return (
    <Box
      style={{
        backgroundImage: `url('${logoutImage}')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: "#c1c085e7",
        color: "#000",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Paper
        sx={{
          backgroundColor: "#e0e0e198",
          padding: 1,
          textAlign: "center",
          width: "100vw",
          position: "absolute",
          bottom: "0",
          left: "0",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontStyle: "italic", fontWeight: "bold" }}
        >
          You are now logged out from{" "}
          <span
            style={{
              fontStyle: "normal",
              fontFamily: "Sonsie One",
              color: "#fffb00",
            }}
          >
            snip
          </span>
          .
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontStyle: "italic", fontWeight: "bold" }}
        >
          See you again soon...
        </Typography>
      </Paper>
      <Tooltip title="Back to Login">
        <Fab
          size="small"
          color="secondary"
          sx={{ position: "absolute", right: 15, top: 10 }}
          onClick={() => history.push("/login")}
        >
          <Typography variant="h5">{timer}</Typography>
        </Fab>
      </Tooltip>
    </Box>
  );
}
export default Logout;
