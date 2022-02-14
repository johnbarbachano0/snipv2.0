import React, { useEffect, useState } from "react";
import { logoutUser } from "../../api/api";
import {
  getLogoutImage,
  getLogoutImageMobile,
} from "../../components/MiscJavascript";
import { Box, Fab, Paper, Tooltip, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import useWindowDimensions from "../../components/useWindowDimension";
import useCountdown from "../../components/useCountdown";

function Logout() {
  const dimension = useWindowDimensions();
  const isMobile = dimension?.width < 480;
  const { id } = useParams();
  const [logoutImage, setLogoutImage] = useState("");
  const history = useHistory();
  const [countdown] = useCountdown(60);

  useEffect(() => {
    const image = isMobile ? getLogoutImageMobile() : getLogoutImage();
    setLogoutImage(image);
    const unsubscribe = logoutUser(id);
    sessionStorage.clear();
    return () => unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    countdown === 0 && history.push("/login");
    return () => countdown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  return (
    <Box
      style={{
        backgroundImage: `url('${logoutImage}')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: "#c1c085e7",
        color: "#000",
        height: isMobile ? dimension.height : "100vh",
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
          <Typography variant="h5">{countdown}</Typography>
        </Fab>
      </Tooltip>
    </Box>
  );
}
export default Logout;
