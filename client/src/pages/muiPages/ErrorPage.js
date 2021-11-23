import React from "react";
import { useParams, useHistory } from "react-router-dom";

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
  error500: {
    color: "#f53e3e",
    fontSize: "7rem",
  },
  error404: {
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

function ErrorPage() {
  const { errType } = useParams();
  const history = useHistory();
  return (
    <div style={style.errorBgCont}>
      <div style={style.errorPageCont}>
        {errType === "500" ? (
          <>
            <div style={style.error500}>500</div>
            <div style={style.errorText}>Server Error</div>
            <div style={style.errorMessage}>
              Things are a little unstable here. I suggest come back later.
            </div>
          </>
        ) : (
          <>
            <div style={style.error404}>404</div>
            <div style={style.errorText}>Not Found</div>
            <div style={style.errorMessage}>
              The page you are looking for might have been removed, had its name
              changed or is temporarily unavailable.
            </div>
          </>
        )}
        <button style={style.errorButton} onClick={() => history.push("/")}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
