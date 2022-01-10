import React from "react";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = sessionStorage.user;
  var sessionExpiry = JSON.parse(sessionStorage?.getItem("session"))?.cookie
    .expires;
  const id = JSON.parse(sessionStorage?.getItem("user"))?.id;
  const today = new Date().toISOString();
  const isSessionExpired = today > sessionExpiry;

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isSessionExpired ? (
          <Redirect to={`/timeout/${id}/session`} />
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default ProtectedRoute;
