import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ThemeContext from "./components/muiComponents/ThemeContext";
import Homepage from "./pages/muiPages/Homepage";
import Linker from "./pages/muiPages/Linker";
import PinPage from "./pages/muiPages/PinPage";
import Profile from "./pages/muiPages/Profile";
import About from "./pages/muiPages/About";
import Logout from "./pages/muiPages/Logout";
import Login from "./pages/muiPages/Login";
import ErrorPage from "./pages/muiPages/ErrorPage";
import ProtectedRoute from "./pages/muiPages/ProtectedRoute";

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
          <ProtectedRoute path="/pin/:id" exact component={PinPage} />
          <ProtectedRoute path="/logout" exact component={Logout} />
        </Switch>
      </Router>
    </ThemeContext>
  );
}

export default App;
