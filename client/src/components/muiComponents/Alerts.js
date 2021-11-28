import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

const alertStyle = {
  margin: 0,
  border: 0,
  borderRadius: 5,
  fontSize: 16,
  padding: 8,
  width: 300,
  position: "fixed",
  bottom: 10,
  left: 10,
  marginBottom: 8,
  zIndex: 10,
};

function Alerts({ type, message, closeAlert }) {
  return (
    <Stack style={{ ...alertStyle }} spacing={2}>
      <Paper>
        {(type === "failure" || type === "error") && (
          <Alert
            severity="error"
            onClose={() => {
              closeAlert();
            }}
          >
            {message}
          </Alert>
        )}
        {type === "warning" && (
          <Alert
            severity="warning"
            onClose={() => {
              closeAlert();
            }}
          >
            {message}
          </Alert>
        )}
        {type === "info" && (
          <Alert
            severity="info"
            onClose={() => {
              closeAlert();
            }}
          >
            {message}
          </Alert>
        )}
        {type === "success" && (
          <Alert
            severity="success"
            onClose={() => {
              closeAlert();
            }}
          >
            {message}
          </Alert>
        )}
      </Paper>
    </Stack>
  );
}

export default Alerts;
