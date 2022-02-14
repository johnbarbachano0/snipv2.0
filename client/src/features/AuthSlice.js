import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    authData: null,
  },
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.value.auth = action.payload;
    },
  },
});

export const { setAuth } = AuthSlice.actions;

export default AuthSlice.reducer;
