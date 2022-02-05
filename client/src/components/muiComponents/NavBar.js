import useStyles from "./NavBar.style";
import React, { useContext, useState, useRef, useEffect } from "react";
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
import DownloadIcon from "@mui/icons-material/DownloadRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PdfIcon from "@mui/icons-material/PictureAsPdfRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AppMenu from "./AppMenu";
import NavActionsMobile from "./NavActionsMobile";

function NavBar({ page, isLoading, onAdd, onSearch, onExport, onPdf }) {
  const classes = useStyles();
  const { darkMode, setDark, isMobile } = useContext(themeContext);
  const [anchorEl, setAnchorEl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [actionsAnchorEl, setActionsAnchorEl] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const navSearchEl = useRef(null);
  const submitEl = useRef(null);
  const cancelEl = useRef(null);
  const showSearch =
    page === "home" ||
    page === "links" ||
    page === "history" ||
    page === "access" ||
    page === "tracker";
  const showAdd =
    page === "home" || page === "links" || page === "pin" || page === "tracker";
  const showExport =
    page === "history" || page === "access" || page === "tracker";
  const showPdf = page === "history" || page === "access" || page === "tracker";

  useEffect(() => {
    navSearchEl?.current?.focus();
  }, [isLoading]);

  useEffect(() => {
    const unsubscribe =
      showSearch && document.addEventListener("keydown", handleKeyPress);
    return () => unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyPress(e) {
    e.key === "Enter" && handleSubmitEnter();
    e.key === "Escape" && handleCancel();
  }

  function handleSubmit() {
    searchVal?.length > 0 && onSearch(searchVal);
  }

  function handleSubmitEnter() {
    const searchValue = navSearchEl?.current?.value;
    searchValue?.length > 0 && onSearch(searchValue);
  }

  function handleCancel() {
    setSearchVal("");
    onSearch("");
  }

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
        {showSearch && (
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
                        onClick={handleCancel}
                        ref={cancelEl}
                      />
                    </Tooltip>
                    <Tooltip title="Search">
                      <SearchRoundedIcon
                        className={classes.searchIcon}
                        onClick={handleSubmit}
                        ref={submitEl}
                      />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              hiddenLabel
              inputProps={{ autoCapitalize: "none", ref: navSearchEl }}
              placeholder="Search..."
              size="small"
              variant="filled"
              disabled={isLoading || !showSearch}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              sx={{
                display: !showSearch ? "none" : "flex",
              }}
            />
          </Grid>
        )}
        <Grid item className={classes.actionBox}>
          <Grid container direction="row">
            {!isMobile && (
              <>
                {showAdd && (
                  <Tooltip
                    title={
                      page === "home"
                        ? "Add New Pin"
                        : page === "links"
                        ? "Add New Link"
                        : page === "pin"
                        ? "Add New Comment"
                        : page === "tracker"
                        ? "Add New Tracker"
                        : "Add New"
                    }
                  >
                    <span>
                      <Fab
                        size="small"
                        color="secondary"
                        onClick={() => onAdd()}
                        disabled={isLoading}
                        sx={{ marginLeft: 0.25, marginRight: 0.25 }}
                      >
                        <AddIcon />
                      </Fab>
                    </span>
                  </Tooltip>
                )}
                {showExport && (
                  <Tooltip title={"Export to CSV"}>
                    <span>
                      <Fab
                        size="small"
                        color="secondary"
                        onClick={() => onExport()}
                        disabled={isLoading}
                        sx={{ marginLeft: 0.25, marginRight: 0.25 }}
                      >
                        <DownloadIcon />
                      </Fab>
                    </span>
                  </Tooltip>
                )}
                {showPdf && (
                  <Tooltip title={"Export to PDF"}>
                    <span>
                      <Fab
                        size="small"
                        color="secondary"
                        onClick={() => onPdf()}
                        disabled={isLoading}
                        sx={{ marginLeft: 0.25, marginRight: 0.25 }}
                      >
                        <PdfIcon />
                      </Fab>{" "}
                    </span>
                  </Tooltip>
                )}
                <Tooltip title={darkMode ? "Lights on" : "Lights off"}>
                  <Fab
                    size="small"
                    color="secondary"
                    onClick={() => setDark(!darkMode)}
                    sx={{ marginLeft: 0.25, marginRight: 0.25 }}
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
                <Tooltip title={"Actions"}>
                  <Fab
                    size="small"
                    color="secondary"
                    onClick={handleActions}
                    sx={{ marginLeft: 0.5, marginRight: 0.5 }}
                  >
                    <MoreVertIcon />
                  </Fab>
                </Tooltip>
                <NavActionsMobile
                  page={page}
                  actionsAnchorEl={actionsAnchorEl}
                  actionsOpen={actionsOpen}
                  handleActionsClose={handleActionsClose}
                  onAdd={() => onAdd()}
                  onExport={() => onExport()}
                  showAdd={showAdd}
                  showExport={showExport}
                  onPdf={() => onPdf()}
                  showPdf={showPdf}
                  isLoading={isLoading}
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
