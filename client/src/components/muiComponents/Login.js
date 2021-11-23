import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schema/loginSchema";
import { removeSpace } from "../MiscJavascript";
import { authenticateUser } from "../../api/api";
import { useHistory } from "react-router-dom";
import { Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

function Login() {
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState("");
  const [uname, setUname] = useState("");
  const [pword, setPword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [errorMsg]);

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
        }}
        InputProps={{ style: { fontSize: 16, borderRadius: 15 } }}
        required
        error={errors.username ? true : false}
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
        }}
        InputProps={{ style: { fontSize: 16, borderRadius: 15 } }}
        required
        error={errors.password || errorMsg ? true : false}
        sx={{ marginTop: 1 }}
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
      <LoadingButton
        onClick={handleSubmit(onSubmit)}
        color="primary"
        loading={loading}
        variant="contained"
        fullWidth={true}
        sx={{ marginTop: 1, padding: 1.5, borderRadius: 3 }}
      >
        Submit
      </LoadingButton>
    </Box>
  );
}
export default Login;
