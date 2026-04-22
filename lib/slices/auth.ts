import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  auth: string;
}

const initialState: AuthState = {
  auth: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.auth = action.payload;
    },
    clearToken: (state) => {
      state.auth = "";
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
