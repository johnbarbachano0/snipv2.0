import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ThemeContext from "./components/muiComponents/ThemeContext";
import Homepage from "./pages/muiPages/Homepage";
import Linker from "./pages/muiPages/Linker";
import PinPage from "./pages/muiPages/PinPage";
import Profile from "./pages/muiPages/Profile";
import About from "./pages/muiPages/About";
import Access from "./pages/muiPages/Access";
import History from "./pages/muiPages/History";
import Tracker from "./pages/muiPages/Tracker";
import Logout from "./pages/muiPages/Logout";
import Login from "./pages/muiPages/Login";
import ErrorPage from "./pages/muiPages/ErrorPage";
import Timeout from "./pages/muiPages/Timeout";
import ProtectedRoute from "./pages/muiPages/ProtectedRoute";
import Socials from "./pages/muiPages/Socials";
import { store } from "./store/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
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
            <ProtectedRoute path="/access" exact component={Access} />
            <ProtectedRoute path="/tracker" exact component={Tracker} />
            <ProtectedRoute path="/pin/:id" exact component={PinPage} />
            <ProtectedRoute path="/logout/:id" exact component={Logout} />
            <Route path="/timeout/:id/:timeoutType" component={Timeout} />
            <Route path="/login/:provider/:authStatus" component={Socials} />
          </Switch>
        </Router>
      </ThemeContext>
    </Provider>
  );
}

export default App;
