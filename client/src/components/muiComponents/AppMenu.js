import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import HistoryIcon from "@mui/icons-material/History";
import AccountIcon from "@mui/icons-material/AccountCircleRounded";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import ChangeCircle from "@mui/icons-material/ChangeCircleOutlined";

const style = {
  item: { "&:hover": { color: "#00A19D" } },
};

function AppMenu({ page, anchorEl, menuOpen, handleMenuClose }) {
  const userObj = JSON.parse(sessionStorage.user);
  const history = useHistory();

  const menuItems = [
    {
      label: "Home",
      icon: <HomeRoundedIcon />,
      path: "/",
      isDisplayed: page !== "home",
    },
    {
      label: "Links",
      icon: <LanguageRoundedIcon />,
      path: "/links",
      isDisplayed: page !== "links",
    },
    {
      label: "Tracker",
      icon: <ChangeCircle />,
      path: "/tracker",
      isDisplayed: page !== "tracker",
    },
    {
      label: "Profile",
      icon: <AssignmentIndRoundedIcon />,
      path: "/profile",
      isDisplayed: page !== "profile",
    },
    {
      label: "Access",
      icon: <AccountIcon />,
      path: "/access",
      isDisplayed: page !== "access" && userObj.role === "Admin",
    },
    {
      label: "History",
      icon: <HistoryIcon />,
      path: "/history",
      isDisplayed: page !== "history",
    },
    {
      label: "About",
      icon: <InfoIcon />,
      path: "/about",
      isDisplayed: page !== "about",
    },
    {
      label: "Logout",
      icon: <ExitToAppRoundedIcon />,
      path: `/logout/${userObj.id}`,
      isDisplayed: page !== "logout",
      additionalStyle: { "&:hover": { color: "#FF0000" } },
    },
  ];

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
      {menuItems.map((item) => (
        <MenuItem
          key={item.label}
          sx={{
            ...style.item,
            display: item.isDisplayed ? "flex" : "none ",
            ...item.additionalStyle,
          }}
          onClick={() => history.push(item.path)}
        >
          {item.icon} {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default AppMenu;
