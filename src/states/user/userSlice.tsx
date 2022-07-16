import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
  },
  reducers: {
    setUserAuthed: (state: any) => {
      state.isLogin = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserAuthed } = userSlice.actions;

export default userSlice.reducer;
