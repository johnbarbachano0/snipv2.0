import React from "react";
import { Avatar, Chip, Tooltip } from "@mui/material";

function CustomChip({ user, onChatWith }) {
  const userObj = JSON.parse(sessionStorage.user);

  const handleClick = (userId, displayName) => {
    onChatWith(userId, displayName);
  };

  return (
    <Tooltip title={user?.displayName} placement={"right"}>
      <Chip
        key={user?.UserId}
        avatar={<Avatar>{user?.displayName.charAt(0).toUpperCase()}</Avatar>}
        label={
          userObj.id === user?.UserId
            ? "You"
            : user?.displayName.length <= 12
            ? user?.displayName
            : user?.displayName?.substring(0, 12) + "..."
        }
        color={"secondary"}
        sx={{
          width: 125,
          justifyContent: "left",
          borderRadius: 0,
          padding: 1.5,
        }}
        onClick={
          userObj.id !== user?.UserId
            ? () => handleClick(user?.UserId, user?.displayName)
            : null
        }
      />
    </Tooltip>
  );
}

export default CustomChip;
