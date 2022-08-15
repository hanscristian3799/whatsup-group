import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state, action) {
      state.user = {};
    },
    editUser(state, action) {
      state.user = {
        ...state.user,
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
      };
    },
  },
});

export const { setUser, clearUser, editUser } = userSlice.actions;

export const user = (state) => state.user.user;

export default userSlice.reducer;
