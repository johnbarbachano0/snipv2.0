import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetMaintenanceQuery } from "../../services/MaintenanceService";
import { setMaintenanceData } from "../../features/MaintenanceSlice";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const { data } = useGetMaintenanceQuery();
  const dispatch = useDispatch();
  const isAuthenticated = sessionStorage.user;
  var sessionExpiry = JSON.parse(sessionStorage?.getItem("session"))?.cookie
    .expires;
  const id = JSON.parse(sessionStorage?.getItem("user"))?.id;
  const today = new Date().toISOString();
  const isSessionExpired = today > sessionExpiry;

  useEffect(() => {
    dispatch(setMaintenanceData(data || []));
  }, [data, dispatch]);

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
