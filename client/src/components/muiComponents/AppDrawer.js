import React, { useState, useContext } from "react";
import { themeContext } from "./ThemeContext";
import {
  Button,
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
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

const topDrawerItems = (page, userObj) => {
  return [
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
  ];
};

const bottomDrawerItems = (page, userObj) => [
  {
    label: "Logout",
    icon: <ExitToAppRoundedIcon />,
    path: `/logout/${userObj.id}`,
    isDisplayed: page !== "logout",
    additionalStyle: { "&:hover": { color: "#FF0000" } },
  },
];

function AppDrawer({ page, open, onClose }) {
  const { isMobile } = useContext(themeContext);
  const history = useHistory();
  const drawerLoc = isMobile ? "bottom" : "left";
  const userObj = JSON.parse(sessionStorage.user);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "bottom" ? "auto" : 200 }}
      role="presentation"
      onClick={onClose}
    >
      <List>
        {topDrawerItems(page, userObj).map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => history.push(item.path)}
            sx={{
              ...style.item,
              ...item.additionalStyle,
              display: item.isDisplayed ? "flex" : "none ",
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {bottomDrawerItems(page, userObj).map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => history.push(item.path)}
            sx={{
              ...style.item,
              ...item.additionalStyle,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer anchor={drawerLoc} open={open} onClose={onClose}>
      {list(drawerLoc)}
    </Drawer>
  );
}

export default AppDrawer;
