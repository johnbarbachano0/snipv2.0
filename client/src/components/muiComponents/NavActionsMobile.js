import React, { useContext } from "react";
import { themeContext } from "./ThemeContext";
import { Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const styles = {
  darkIcon: {
    color: "black",
    fontSize: 30,
  },
  lightIcon: {
    color: "#FBFF00",
    fontSize: 30,
  },
};

function NavActionsMobile({
  page,
  actionsAnchorEl,
  actionsOpen,
  handleActionsClose,
  onAddNewPin,
  onAddNewLink,
  onAddNewComment,
  showAdd,
}) {
  const { darkMode, setDark } = useContext(themeContext);
  return (
    <Menu
      anchorEl={actionsAnchorEl}
      open={actionsOpen}
      onClose={() => handleActionsClose()}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {showAdd && (
        <MenuItem
          onClick={() => {
            page === "home" && onAddNewPin();
            page === "links" && onAddNewLink();
            page === "pin" && onAddNewComment();
            handleActionsClose();
          }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <AddIcon />
        </MenuItem>
      )}
      <MenuItem onClick={() => setDark(!darkMode)}>
        {darkMode ? (
          <LightModeIcon style={styles.lightIcon} />
        ) : (
          <DarkModeIcon style={styles.darkIcon} />
        )}
      </MenuItem>
    </Menu>
  );
}

export default NavActionsMobile;
