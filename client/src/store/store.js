import { configureStore } from "@reduxjs/toolkit";
import MaintenanceReducer from "../features/MaintenanceSlice";
import { maintenanceApi } from "../services/MaintenanceService";
import AuthReducer from "../features/AuthSlice";
import { authApi } from "../services/AuthService";

export const store = configureStore({
  reducer: {
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    maintenance: MaintenanceReducer,
    auth: AuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(maintenanceApi.middleware),
});
