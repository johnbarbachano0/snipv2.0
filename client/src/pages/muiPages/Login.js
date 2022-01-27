import React, { useState, useEffect, useContext } from "react";
import { Box, Card, Fab, Tooltip, Typography } from "@mui/material";
import Login from "../../components/muiComponents/Login";
import Register from "../../components/muiComponents/Register";
import {
  getLoginImage,
  getLoginImageMobile,
} from "../../components/MiscJavascript";
import useStyles from "./Pages.style";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { themeContext } from "../../components/muiComponents/ThemeContext";
import useWindowDimensions from "../../components/useWindowDimension";

function LoginPage() {
  const dimension = useWindowDimensions();
  const isMobile = dimension?.width < 480;
  const classes = useStyles();
  const { darkMode, setDark } = useContext(themeContext);
  const [type, setType] = useState("login");
  const [loginImage, setLoginImage] = useState("");

  function handleType(type) {
    setType(type);
  }

  useEffect(() => {
    const image = isMobile ? getLoginImageMobile() : getLoginImage();
    setLoginImage(image);
  }, [isMobile]);

  return (
    <Box
      className={classes.bgContainer}
      sx={{
        backgroundImage: `url('${loginImage}')`,
        height: dimension.height,
      }}
    >
      <Card
        className={(classes.loginContainer, classes.center)}
        sx={{
          borderRadius: 5,
          width: isMobile ? dimension.width * 0.75 : 250,
          minWidth: 300,
          background: darkMode
            ? "rgba(0, 0, 0, 0.60)"
            : "rgba(255,255, 255, 0.75)",
        }}
      >
        <Box>
          <Box className={classes.loginTitle}>
            <Box
              className={type === "login" ? classes.loginActive : undefined}
              onClick={() => handleType("login")}
            >
              <Typography variant="h5" className={classes.loginTitleText}>
                Login
              </Typography>
            </Box>
            <Box
              className={type === "register" ? classes.loginActive : undefined}
              onClick={() => handleType("register")}
            >
              <Typography variant="h5" className={classes.loginTitleText}>
                Register
              </Typography>
            </Box>
          </Box>
          {type === "login" && <Login />}
          {type === "register" && (
            <Register onLoginLink={() => handleType("login")} />
          )}
          {type === "login" ? (
            <Typography variant="body1" className={classes.loginFooterText}>
              No account yet?{" "}
              <span
                onClick={() => handleType("register")}
                className={classes.loginFooterText}
              >
                <u>Sign Up</u>
              </span>
            </Typography>
          ) : (
            <Typography variant="body1" className={classes.loginFooterText}>
              Already have an account?{" "}
              <span onClick={() => handleType("login")}>
                <u>Login</u>
              </span>
            </Typography>
          )}
        </Box>
      </Card>
      <Box sx={{ position: "absolute", right: 15, top: 10 }}>
        <Tooltip title={darkMode ? "Lights on" : "Lights off"}>
          <Fab
            size="small"
            color="secondary"
            onClick={() => setDark(!darkMode)}
          >
            {darkMode ? (
              <LightModeIcon className={classes.lightIcon} />
            ) : (
              <DarkModeIcon className={classes.darkIcon} />
            )}
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default LoginPage;
