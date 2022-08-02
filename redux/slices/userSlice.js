import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    displayName: "",
    email: "",
    photoURL: "",
    token: "",
  },
};

const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      console.log("PAYLOAD", action.payload);
      state.user = action.payload;
    },
    clearCurrentUserData(state) {
      state.user = {
        displayName: "",
        email: "",
        photoURL: "",
        token: "",
      };
    },
  },
});

export const { setCurrentUser, clearCurrentUserData } = counterSlice.actions;

export const user = (state) => state.user.user;

export default counterSlice.reducer;
