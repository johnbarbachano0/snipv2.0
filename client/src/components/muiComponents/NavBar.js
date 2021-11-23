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
  ClickAwayListener,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AppMenu from "./AppMenu";

function NavBar({
  page,
  isLoading,
  onAddNewPin,
  onAddNewLink,
  onAddNewComment,
  onSearch,
}) {
  const classes = useStyles();
  const { darkMode, setDark } = useContext(themeContext);
  const [anchorEl, setAnchorEl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  }
  function handleMenuClose() {
    setAnchorEl("");
    setMenuOpen(false);
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
          <ClickAwayListener onClickAway={handleMenuClose}>
            <Box
              className={menuOpen ? classes.logoBox_active : classes.logoBox}
              onClick={handleMenu}
            >
              <MenuRoundedIcon
                sx={{ fontSize: 30, position: "relative", top: 8 }}
              />
              snip
            </Box>
          </ClickAwayListener>
          <AppMenu
            page={page}
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleMenuClose={handleMenuClose}
          />
        </Grid>
        <Grid item xs={5} className={classes.searchBox}>
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
            disabled={isLoading}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </Grid>
        <Grid item className={classes.actionBox}>
          <Grid container direction="row">
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
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
}

export default NavBar;
