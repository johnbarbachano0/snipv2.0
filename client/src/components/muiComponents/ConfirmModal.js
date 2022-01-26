import React, { useEffect, useRef } from "react";
import { Button, Grid, Modal, Paper, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const style = {
  container: {
    border: "1px solid #fff",
    borderRadius: 5,
    padding: 20,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    maxWidth: "80vw",
  },
};

function ConfirmModal({
  action,
  openModal,
  onClickYes,
  onClickCancel,
  confirmLoading,
}) {
  const submitEl = useRef(null);

  useEffect(() => {
    const unsubscribe = document.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
  }, []);

  function handleKeyPress(event) {
    event.key === "Enter" && submitEl?.current?.focus()?.click();
  }

  return (
    <Modal open={openModal} onClose={onClickCancel}>
      <Paper style={{ ...style.container }}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h6">{action}</Typography>
          </Grid>
          <Grid item>
            <LoadingButton
              onClick={onClickYes}
              color="primary"
              loading={confirmLoading}
              variant="contained"
              sx={{ width: "45%", margin: 0.5 }}
              ref={submitEl}
            >
              Yes
            </LoadingButton>
            <Button
              variant="contained"
              color="nuetral"
              onClick={onClickCancel}
              sx={{ width: "45%", margin: 0.5 }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
}

export default ConfirmModal;
