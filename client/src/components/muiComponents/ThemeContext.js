import React, { createContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
export const themeContext = createContext(null);

export default function ThemeContext(props) {
  const [darkMode, setDark] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#0277bd", light: "#58a5f0", dark: "#004c8c" },
          secondary: { main: "#00695c", light: "#439889", dark: "#005005" },
          tertiary: { main: "#51C4D3", light: "#51C4D3", dark: "#51C4D3" },
          nuetral: { main: "#C2C2C2", light: "#9F9F9F", dark: "#CDCDCD" },
        },
      }),
    [darkMode]
  );

  return (
    <div>
      <themeContext.Provider value={{ darkMode, setDark, theme, isMobile }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </themeContext.Provider>
    </div>
  );
}
