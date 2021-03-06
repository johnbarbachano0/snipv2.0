import React, { useState, useEffect, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postNewUser } from "../../api/api";
import { removeSpace } from "../MiscJavascript";
import { registerSchema } from "../../schema/loginSchema";
import { Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { themeContext } from "../../components/muiComponents/ThemeContext";

const styles = (darkMode) => {
  return {
    common: {
      borderRadius: 4,
      background: darkMode ? "rgba(0, 0, 0, .90)" : "rgba(218, 223, 225, .95)",
    },
  };
};

function Register({ onLoginLink }) {
  const { darkMode } = useContext(themeContext);
  const [uname, setUname] = useState("");
  const [pword, setPword] = useState("");
  const [rePword, setRePword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successReg, setSuccessReg] = useState(false);
  const [loading, setLoading] = useState(false);
  const submitEl = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    const unsubscribe = window.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
  }, []);

  function handleKeyPress(event) {
    event.key === "Enter" && submitEl?.current?.focus()?.click();
  }

  function onSubmit(data) {
    setLoading(true);
    postNewUser(data).then((res) => {
      if (res.type === "error") {
        setErrorMsg(res.message);
        setLoading(false);
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
      } else if (res.type === "success") {
        setSuccessReg(true);
        setLoading(false);
      }
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    name === "username" && setUname(removeSpace(value));
    name === "password" && setPword(removeSpace(value));
    name === "repassword" && setRePword(removeSpace(value));
  }

  return (
    <div>
      {successReg && (
        <Typography variant="h6" sx={{ padding: 3 }}>
          User has been added successfully. Please click on{" "}
          <span onClick={() => onLoginLink()} style={{ cursor: "pointer" }}>
            <u>Login</u>
          </span>{" "}
          to proceed.
        </Typography>
      )}
      {!successReg && (
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
            error={errors.username ? true : false}
            sx={{ ...styles(darkMode).common }}
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
              ...styles(darkMode).common,
            }}
          />
          {errors.password && (
            <Typography color="error" textAlign="left" fontSize={14}>
              &#x26A0;{errors.password.message}
            </Typography>
          )}
          <TextField
            variant="outlined"
            name="repassword"
            {...register("repassword")}
            value={rePword}
            onChange={handleChange}
            placeholder="@confirm password"
            autoComplete="off"
            fullWidth={true}
            type="password"
            inputProps={{
              maxLength: 250,
              autoCapitalize: "none",
            }}
            InputProps={{ style: { fontSize: 16, borderRadius: 15 } }}
            required
            error={errors.repassword ? true : false}
            sx={{
              marginTop: 1,
              ...styles(darkMode).common,
            }}
          />
          {errors.repassword && (
            <Typography color="error" textAlign="left" fontSize={14}>
              &#x26A0;{errors.repassword.message}
            </Typography>
          )}
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
      )}
    </div>
  );
}

export default Register;
