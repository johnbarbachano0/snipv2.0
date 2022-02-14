import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { getHourMin } from "../../MiscJavascript";
import { CheckRounded, RefreshRounded } from "@mui/icons-material";

const styles = {
  msgContainer: {
    display: "flex",
    flexDirection: "column",
    margin: 0.5,
    minWidth: 150,
    maxWidth: "80%",
  },
  message: {
    borderRadius: 2,
    padding: 1,
    textAlign: "left",
  },
  messageCenter: {
    backgroundColor: "#50F090",
    borderRadius: 8,
  },
  messageLeft: {
    backgroundColor: "#009090",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 8,
  },
  messageRight: {
    backgroundColor: "#FF7070",
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 12,
  },
  details: {
    fontSize: 10,
  },
  icon: {
    fontSize: 11,
    position: "relative",
    top: 1.5,
  },
};

function MessageBox({ list, isSameUser, isChatbot }) {
  return (
    <Box
      sx={{
        ...styles.msgContainer,
        alignSelf: isChatbot
          ? "center"
          : isSameUser
          ? "flex-end"
          : "flex-start",
      }}
    >
      <Card
        sx={[
          styles.message,
          isChatbot
            ? styles.messageCenter
            : isSameUser
            ? styles.messageLeft
            : styles.messageRight,
        ]}
      >
        <Typography
          style={{
            ...styles.messageText,
            textAlign: isChatbot ? "center" : null,
          }}
        >
          {list.message}
        </Typography>
      </Card>
      <Typography
        sx={{
          ...styles.details,
          textAlign: isChatbot ? "center" : isSameUser ? "right" : "left",
        }}
      >
        @{list.user} {getHourMin(list?.createdAt)}{" "}
        <span style={{ color: list?.isSent ? null : "red" }}>
          {list?.isSent ? (
            <CheckRounded sx={styles.icon} />
          ) : (
            <RefreshRounded sx={styles.icon} />
          )}
        </span>
      </Typography>
    </Box>
  );
}

export default MessageBox;
