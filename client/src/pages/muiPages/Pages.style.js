import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  linkerDataGridContainer: {
    height: "85vh",
    width: "80vw",
    marginTop: 60,
  },
  bgContainer: {
    width: "100vw",
    height: "100vh",
    display: " flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#51f6ee42",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  loginContainer: {
    "& p": { cursor: "pointer" },
    backgroundColor: "#6494edc0",
    display: "flex",
    flexDirection: "column",
    opacity: 0.5,
  },
  loginTitle: {
    "& *": { cursor: "pointer", width: "100%" },
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  loginTitleText: { padding: 15 },
  loginFooterText: { paddingBottom: 10, "& span": { cursor: "pointer" } },
  loginActive: { backgroundColor: "#fb8b3b" },
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

export default useStyles;
