import useStyles from "./NavBar.style";
import React, { useContext, useState } from "react";
import { themeContext } from "./ThemeContext";
import {
  AppBar,
  Box,
  InputAdornment,
  Fab,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AppMenu from "./AppMenu";
import NavActionsMobile from "./NavActionsMobile";

function NavBar({
  page,
  isLoading,
  onAddNewPin,
  onAddNewLink,
  onAddNewComment,
  onSearch,
}) {
  const classes = useStyles();
  const { darkMode, setDark, isMobile } = useContext(themeContext);
  const [anchorEl, setAnchorEl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [actionsAnchorEl, setActionsAnchorEl] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  }
  function handleMenuClose() {
    setAnchorEl("");
    setMenuOpen(false);
  }

  function handleActions(event) {
    setActionsAnchorEl(event.currentTarget);
    setActionsOpen(true);
  }
  function handleActionsClose() {
    setAnchorEl("");
    setActionsOpen(false);
  }

  return (
    <AppBar className={classes.appBar}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item sx={{ position: "relative", bottom: 4 }}>
          <Box
            className={menuOpen ? classes.logoBox_active : classes.logo}
            onClick={handleMenu}
          >
            <MenuRoundedIcon
              sx={{ fontSize: 30, position: "relative", top: 8 }}
            />
            <Box sx={{ display: isMobile ? "none" : "inline" }}>snip</Box>
          </Box>
          <AppMenu
            page={page}
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleMenuClose={handleMenuClose}
          />
        </Grid>
        <Grid item xs={isMobile ? 8 : 5} className={classes.searchBox}>
          <TextField
            className={classes.textSearch}
            color="warning"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Clear">
                    <ClearRoundedIcon
                      className={classes.deleteIcon}
                      onClick={() => {
                        setSearchVal("");
                        onSearch("");
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Search">
                    <SearchRoundedIcon
                      className={classes.searchIcon}
                      onClick={() =>
                        searchVal.length > 0 && onSearch(searchVal)
                      }
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            hiddenLabel
            placeholder="Search..."
            size="small"
            variant="filled"
            disabled={
              isLoading ||
              page === "pin" ||
              page === "about" ||
              page === "profile"
            }
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            sx={{
              display:
                page === "pin" || page === "about" || page === "profile"
                  ? "none"
                  : "flex",
            }}
          />
        </Grid>
        <Grid item className={classes.actionBox}>
          <Grid container direction="row">
            {!isMobile && (
              <>
                <Tooltip
                  title={
                    page === "home"
                      ? "Add New Pin"
                      : page === "links"
                      ? "Add New Link"
                      : page === "pin"
                      ? "Add New Comment"
                      : "Add New"
                  }
                  sx={{ marginLeft: 0.5, marginRight: 0.5 }}
                >
                  <Fab size="small" color="secondary">
                    <AddIcon
                      onClick={() => {
                        page === "home" && onAddNewPin();
                        page === "links" && onAddNewLink();
                        page === "pin" && onAddNewComment();
                      }}
                    />
                  </Fab>
                </Tooltip>
                <Tooltip
                  title={darkMode ? "Lights on" : "Lights off"}
                  sx={{ marginLeft: 0.5, marginRight: 0.5 }}
                >
                  <Fab
                    size="small"
                    color="secondary"
                    onClick={() => setDark(!darkMode)}
                  >
                    {darkMode ? (
                      <LightModeIcon className={classes.lightIcon} />
                    ) : (
                      <DarkModeIcon className={classes.darkIcon} />
                    )}
                  </Fab>
                </Tooltip>
              </>
            )}
            {isMobile && (
              <>
                <Tooltip
                  title={"Actions"}
                  sx={{ marginLeft: 0.5, marginRight: 0.5 }}
                >
                  <Fab size="small" color="secondary" onClick={handleActions}>
                    <MoreVertIcon />
                  </Fab>
                </Tooltip>
                <NavActionsMobile
                  page={page}
                  actionsAnchorEl={actionsAnchorEl}
                  actionsOpen={actionsOpen}
                  handleActionsClose={handleActionsClose}
                  onAddNewPin={() => onAddNewPin()}
                  onAddNewLink={() => onAddNewLink()}
                  onAddNewComment={() => onAddNewComment()}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
}

export default NavBar;
