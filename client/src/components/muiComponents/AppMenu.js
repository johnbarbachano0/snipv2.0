import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
const style = {
  item: { "&:hover": { color: "#00A19D" } },
  logout: { "&:hover": { color: "#FF0000" } },
};

function AppMenu({ page, anchorEl, menuOpen, handleMenuClose }) {
  const userObj = JSON.parse(sessionStorage.user);
  const history = useHistory();
  return (
    <Menu
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {page !== "home" && (
        <MenuItem sx={{ ...style.item }} onClick={() => history.push("/")}>
          <HomeRoundedIcon />
          Home
        </MenuItem>
      )}
      {page !== "links" && (
        <MenuItem sx={{ ...style.item }} onClick={() => history.push("/links")}>
          <LanguageRoundedIcon />
          Links
        </MenuItem>
      )}
      {page !== "profile" && (
        <MenuItem
          sx={{ ...style.item }}
          onClick={() => history.push("/profile")}
        >
          <AssignmentIndRoundedIcon />
          Profile
        </MenuItem>
      )}
      {page !== "about" && (
        <MenuItem sx={{ ...style.item }} onClick={() => history.push("/about")}>
          <InfoIcon />
          About
        </MenuItem>
      )}
      <MenuItem
        sx={{ ...style.logout }}
        onClick={() => history.push(`/logout/${userObj.id}`)}
      >
        <ExitToAppRoundedIcon />
        Logout
      </MenuItem>
    </Menu>
  );
}

export default AppMenu;
