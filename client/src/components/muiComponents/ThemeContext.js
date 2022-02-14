import React, { createContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
export const themeContext = createContext(null);

export default function ThemeContext(props) {
  const [darkMode, setDark] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#006266" : "#144550" },
      secondary: { main: darkMode ? "#00bbf9" : "#009DAE" },
      tertiary: { main: darkMode ? "#0277bd" : "#004c8c" },
      nuetral: { main: darkMode ? "#C2C2C2" : "#CDCDCD" },
    },
    typography: {
      button: {
        textTransform: "none",
      },
    },
  });

  return (
    <div>
      <themeContext.Provider value={{ darkMode, setDark, isMobile }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </themeContext.Provider>
    </div>
  );
}
