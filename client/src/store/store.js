import { configureStore } from "@reduxjs/toolkit";
import MaintenanceReducer from "../features/MaintenanceSlice";
import { maintenanceApi } from "../services/MaintenanceService";

export const store = configureStore({
  reducer: {
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    maintenance: MaintenanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(maintenanceApi.middleware),
});
