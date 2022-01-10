import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { logoutUser } from "../../api/api";
import { Fab, Typography, Tooltip } from "@mui/material";

const style = {
  errorBgCont: {
    backgroundColor: "rgba(19, 229, 248, 0875)",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  errorPageCont: {
    display: "flex",
    flexDirection: "column",
    justifySelf: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "60%",
    "& *": {
      padding: "0.5rem",
    },
  },
  sessionTimeout: {
    color: "#f53e3e",
    fontSize: "7rem",
  },
  idleTimeout: {
    color: "#ecec06",
    fontSize: "7rem",
  },
  errorText: {
    color: "#ffffff",
    fontSize: "2.5rem",
  },
  errorMessage: {
    fontStyle: "italic",
    fontSize: "1rem",
  },
  errorButton: {
    backgroundColor: "#008000",
    border: "none",
    borderRadius: "5px",
    color: "#ffffff",
    cursor: "pointer",
    padding: "1rem",
    margin: "1rem",
    "&:hover": {
      backgroundColor: "#23a523",
    },
    "&:active": {
      backgroundColor: "#44c744",
    },
  },
};

function Timeout() {
  const { id, timeoutType } = useParams();
  const history = useHistory();
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    logoutUser(id);
    console.log("exec");
    sessionStorage.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div style={style.errorBgCont}>
      <div style={style.errorPageCont}>
        {timeoutType === "session" ? (
          <>
            <div style={style.sessionTimeout}>Timeout</div>
            <div style={style.errorText}>Session Timeout</div>
            <div style={style.errorMessage}>
              Your session has expired. Please login again.
            </div>
          </>
        ) : (
          <>
            <div style={style.idleTimeout}>Timeout</div>
            <div style={style.errorText}>Idle Timeout</div>
            <div style={style.errorMessage}>
              You have been inactive for a while. Please login again to resume
              activity.
            </div>
          </>
        )}
        <button
          style={style.errorButton}
          onClick={() => history.push("/login")}
        >
          Go to Login
        </button>
        {
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
        }
      </div>
    </div>
  );
}

export default Timeout;
