import React from "react";
import {
  Avatar,
  Box,
  Card,
  Chip,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import CustomChip from "./CustomChip";

const styles = {
  container: { borderRadius: 0 },
  header: {
    padding: 0.25,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  user: {
    backgroundColor: "#144550",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerChip: {
    padding: 0.25,
    color: "white",
    width: 125,
    borderRadius: 0,
  },
};

function UsersBox({ onlineUsers, setChatWith }) {
  const userObj = JSON.parse(sessionStorage.user);
  const count = onlineUsers?.length || 0;

  const handleClick = (userId, displayName) => {
    setChatWith({ userId, displayName });
  };

  const usersHeader = () => (
    <Box sx={styles.user}>
      <Chip
        avatar={<Avatar>{count}</Avatar>}
        label="Online"
        sx={styles.headerChip}
        color={"primary"}
        onClick={() => handleClick(0)}
      />
    </Box>
  );

  const list = () => {
    return (
      <>
        {onlineUsers
          .filter((user) => user.status !== false && userObj.id === user.UserId)
          .map((user) => {
            return (
              <CustomChip
                user={user}
                onChatWith={handleClick}
                key={user.UserId}
              />
            );
          })}
        {onlineUsers
          .filter((user) => user.status !== false && userObj.id !== user.UserId)
          .map((user) => {
            return (
              <CustomChip
                user={user}
                onChatWith={handleClick}
                key={user.UserId}
              />
            );
          })}
      </>
    );
  };

  return (
    <Card sx={styles.container}>
      <CardHeader
        component={usersHeader}
        disableTypography={true}
        sx={styles.header}
      />
      <CardContent sx={styles.content}>
        {onlineUsers?.length > 0 ? list() : <Typography>...</Typography>}
      </CardContent>
    </Card>
  );
}

export default UsersBox;
