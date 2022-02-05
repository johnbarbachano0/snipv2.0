import React, { useState, useEffect, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schema/loginSchema";
import { removeSpace } from "../MiscJavascript";
import { authenticateUser } from "../../api/api";
import { useHistory } from "react-router-dom";
import { Box, Fab, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import { themeContext } from "../../components/muiComponents/ThemeContext";
require("dotenv").config();

const styles = {
  socialContainer: {
    display: "flex",
    justifyContent: "space-around",
    margin: 1,
  },
};

function Login() {
  const { darkMode } = useContext(themeContext);
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState("");
  const [uname, setUname] = useState("");
  const [pword, setPword] = useState("");
  const [loading, setLoading] = useState(false);
  const submitEl = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => setErrorMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  useEffect(() => {
    const unsubscribe = window.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
  }, []);

  function handleKeyPress(event) {
    event.key === "Enter" && submitEl?.current?.focus()?.click();
  }

  function onSubmit(data) {
    setLoading(true);
    authenticateUser(data).then((res) => {
      if (res === true) {
        setLoading(false);
        history.push("/");
      } else if (res === false) {
        setLoading(false);
        setErrorMsg("Incorrect password.");
      }
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    name === "username" && setUname(removeSpace(value));
    name === "password" && setPword(removeSpace(value));
  }

  const handleSocials = (authProvider) => {
    try {
      setLoading(true);
      window.location.href = `${process.env.REACT_APP_SERVER}/auth/login/${authProvider}`;
    } catch (error) {
      history.push("/error/404");
    }
  };

  return (
    <Box component="form" noValidate sx={{ padding: 2 }}>
      <TextField
        variant="outlined"
        name="username"
        {...register("username")}
        value={uname}
        onChange={handleChange}
        placeholder="@username"
        autoComplete="off"
        fullWidth={true}
        inputProps={{
          maxLength: 250,
          autoCapitalize: "none",
        }}
        InputProps={{ style: { fontSize: 16, borderRadius: 15 } }}
        required
        autoFocus
        error={errors.username ? true : false}
        sx={{
          borderRadius: 4,
          background: darkMode
            ? "rgba(0, 0, 0, .90)"
            : "rgba(218, 223, 225, .95)",
        }}
      />
      {errors.username && (
        <Typography color="error" textAlign="left" fontSize={14}>
          &#x26A0;{errors.username.message}
        </Typography>
      )}
      <TextField
        variant="outlined"
        name="password"
        {...register("password")}
        value={pword}
        onChange={handleChange}
        placeholder="@password"
        autoComplete="off"
        fullWidth={true}
        type="password"
        inputProps={{
          maxLength: 250,
          autoCapitalize: "none",
        }}
        InputProps={{ style: { fontSize: 16, borderRadius: 15 } }}
        required
        error={errors.password || errorMsg ? true : false}
        sx={{
          marginTop: 1,
          borderRadius: 4,
          background: darkMode
            ? "rgba(0, 0, 0, .90)"
            : "rgba(218, 223, 225, .90)",
        }}
      />
      {errors.password && (
        <Typography color="error" textAlign="left" fontSize={14}>
          &#x26A0;{errors.password.message}
        </Typography>
      )}
      {errorMsg && (
        <Typography color="error" textAlign="left" fontSize={14}>
          &#x26A0;{errorMsg}
        </Typography>
      )}
      <Box sx={styles.socialContainer}>
        <Fab color="primary" size="small" disabled={loading}>
          <GoogleIcon onClick={() => handleSocials("google")} />
        </Fab>
        <Fab color="primary" size="small" disabled={loading}>
          <FacebookOutlinedIcon onClick={() => handleSocials("facebook")} />
        </Fab>
        <Fab color="primary" size="small" disabled={loading}>
          <GitHubIcon onClick={() => handleSocials("github")} />
        </Fab>
      </Box>
      <LoadingButton
        onClick={handleSubmit(onSubmit)}
        color="primary"
        loading={loading}
        variant="contained"
        fullWidth={true}
        sx={{ marginTop: 1, padding: 1.5, borderRadius: 3 }}
        ref={submitEl}
      >
        Submit
      </LoadingButton>
    </Box>
  );
}
export default Login;
