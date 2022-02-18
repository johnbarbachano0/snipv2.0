import React, { useContext } from "react";
import { themeContext } from "./ThemeContext";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
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
import SendIcon from "@mui/icons-material/SendRounded";
import { CapitalizeFirstLetters } from "../MiscJavascript";
import useWindowDimensions from "../useWindowDimension";
import ArrowIcon from "@mui/icons-material/ArrowLeftRounded";

const style = {
  container: {},
  item: { "&:hover": { color: "#fffb00" } },
  itemDisabled: { color: "#fffb00" },
  containerLogo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    "& *": { padding: 1 },
  },
  logo: {
    fontStyle: "normal",
    fontFamily: "Sonsie One",
    fontSize: 20,
    color: "#fffb00",
    textAlign: "center",
    paddingLeft: 2,
  },
  user: { textAlign: "center", paddingRight: 2 },
  arrowIcon: { color: "#fffb00", fontSize: 30 },
};

const topDrawerItems = (page, userObj) => {
  return [
    {
      label: "Home",
      icon: <HomeRoundedIcon />,
      path: "/",
      isDisplayed: true,
      isDisabled: page === "home",
    },
    {
      label: "Links",
      icon: <LanguageRoundedIcon />,
      path: "/links",
      isDisplayed: true,
      isDisabled: page === "links",
    },
    {
      label: "Live Chat",
      icon: <SendIcon />,
      path: "/livechat",
      isDisplayed: true,
      isDisabled: page === "livechat",
    },
    {
      label: "Tracker",
      icon: <ChangeCircle />,
      path: "/tracker",
      isDisplayed: true,
      isDisabled: page === "tracker",
    },
    {
      label: "Profile",
      icon: <AssignmentIndRoundedIcon />,
      path: "/profile",
      isDisplayed: true,
      isDisabled: page === "profile",
    },
    {
      label: "Access",
      icon: <AccountIcon />,
      path: "/access",
      isDisplayed: userObj.role === "Admin",
      isDisabled: page === "access",
    },
    {
      label: "History",
      icon: <HistoryIcon />,
      path: "/history",
      isDisplayed: true,
      isDisabled: page === "history",
    },
    {
      label: "About",
      icon: <InfoIcon />,
      path: "/about",
      isDisplayed: true,
      isDisabled: page === "about",
    },
  ];
};

const bottomDrawerItems = (page, userObj) => [
  {
    label: "Logout",
    icon: <ExitToAppRoundedIcon />,
    path: `/logout/${userObj.id}`,
    isDisplayed: true,
    additionalStyle: { "&:hover": { color: "red" } },
  },
];

function AppDrawer({ page, open, onClose }) {
  const { darkMode, isMobile } = useContext(themeContext);
  const { height } = useWindowDimensions();
  const history = useHistory();
  const drawerLoc = isMobile ? "bottom" : "left";
  const userObj = JSON.parse(sessionStorage.user);

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "bottom" ? "auto" : 400,
        flex: 1,
        backgroundColor: darkMode ? "" : "#144552",
        color: "white",
      }}
      role="presentation"
      onClick={onClose}
    >
      <Box sx={style.containerLogo}>
        <Typography sx={style.logo}>snip</Typography>
        <Typography sx={style.user}>
          @{CapitalizeFirstLetters(userObj?.name || "") || userObj?.username}
        </Typography>
      </Box>
      <Divider />
      <List>
        {topDrawerItems(page, userObj).map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => !item.isDisabled && history.push(item.path)}
            sx={{
              ...style.item,
              ...item.additionalStyle,
              display: item.isDisplayed ? "flex" : "none ",
            }}
            selected={item.isDisabled}
            dense={height < 600 || isMobile}
          >
            <ListItemIcon sx={{ color: "#fffb00" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ color: item.isDisabled ? style.itemDisabled : null }}
            />
            {item.isDisabled && <ArrowIcon sx={style.arrowIcon} />}
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
            <ListItemIcon sx={{ color: "red" }}>{item.icon}</ListItemIcon>
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
