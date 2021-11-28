import { makeStyles } from "@mui/styles";

const appBarCommon = {
  bar: {
    fontSize: "1.25rem",
    padding: 8,
  },
  icon: {
    fontSize: 30,
  },
};

const useStyles = makeStyles({
  appBar: {
    width: "100%",
  },
  logo: {
    color: "#ffea00",
    "&:hover": { color: "rgba(255, 251, 0, 0.635)" },
    fontFamily: "Sonsie One",
    ...appBarCommon.bar,
  },
  logoBox_active: {
    color: "#fff",
    fontFamily: "Sonsie One",
    ...appBarCommon.bar,
  },
  searchBox: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    ...appBarCommon.bar,
  },
  textSearch: {
    width: "100%",
    maxWidth: 400,
    color: "white",
  },
  deleteIcon: {
    "&:hover": { color: "#AE431E" },
    "&:active": { color: "#F90716" },
    cursor: "pointer",
  },
  searchIcon: {
    "&:hover": { color: "#009DAE" },
    "&:active": { color: "#71DFE7" },
    cursor: "pointer",
  },
  actionBox: {
    ...appBarCommon.bar,
  },
  darkIcon: {
    ...appBarCommon.icon,
    color: "black",
  },
  lightIcon: {
    ...appBarCommon.icon,
    color: "#FBFF00",
  },
});

export default useStyles;
