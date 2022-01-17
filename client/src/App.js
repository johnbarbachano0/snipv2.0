import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ThemeContext from "./components/muiComponents/ThemeContext";
import Homepage from "./pages/muiPages/Homepage";
import Linker from "./pages/muiPages/Linker";
import PinPage from "./pages/muiPages/PinPage";
import Profile from "./pages/muiPages/Profile";
import About from "./pages/muiPages/About";
import History from "./pages/muiPages/History";
import Logout from "./pages/muiPages/Logout";
import Login from "./pages/muiPages/Login";
import ErrorPage from "./pages/muiPages/ErrorPage";
import Timeout from "./pages/muiPages/Timeout";
import ProtectedRoute from "./pages/muiPages/ProtectedRoute";
import Socials from "./pages/muiPages/Socials";

function App() {
  return (
    <ThemeContext>
      <Router>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/error/:errType" exact component={ErrorPage} />
          <ProtectedRoute path="/" exact component={Homepage} />
          <ProtectedRoute path="/profile/" exact component={Profile} />
          <ProtectedRoute path="/about" exact component={About} />
          <ProtectedRoute path="/links" exact component={Linker} />
          <ProtectedRoute path="/history" exact component={History} />
          <ProtectedRoute path="/pin/:id" exact component={PinPage} />
          <ProtectedRoute path="/logout/:id" exact component={Logout} />
          <Route path="/timeout/:id/:timeoutType" component={Timeout} />
          <Route path="/login/:provider/:authStatus" component={Socials} />
        </Switch>
      </Router>
    </ThemeContext>
  );
}

export default App;
