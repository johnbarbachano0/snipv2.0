import React, { useEffect, useState } from "react";
import { useParams, useLocation, Redirect, useHistory } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function Socials() {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { authStatus, provider } = useParams();
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const user = urlParams.get("user");
  const session = urlParams.get("session");
  const sessionID = urlParams.get("sessionID");
  sessionStorage.setItem("isAuth", JSON.stringify(true));
  sessionStorage.setItem("user", user);
  sessionStorage.setItem("session", session);
  sessionStorage.setItem("sessionId", sessionID);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    setIsLoggedIn(authStatus === "success" ? true : false);
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === "error") {
      timer === -1 && history.push("/login");
      var timerOut = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearTimeout(timerOut);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [timer, authStatus]);

  const FailedLogin = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Typography variant="h7">
          Error encountered in logging in
          {provider === "oauth" ? "" : " using provider"}.
        </Typography>
        <Typography variant="h7">
          You will be redirected to Login Page in {timer}.
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => history.push("/login")}
        >
          Back to Login
        </Button>
      </Box>
    );
  };

  return (
    <>
      {isLoggedIn && authStatus === "success" && <Redirect to="/" />}
      {authStatus === "error" && FailedLogin()}
    </>
  );
}

export default Socials;
