import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    maintenance: [],
  },
};

export const MaintenanceSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMaintenanceData: (state, action) => {
      state.value.maintenance = action.payload;
    },
  },
});

export const { setMaintenanceData } = MaintenanceSlice.actions;

export default MaintenanceSlice.reducer;
