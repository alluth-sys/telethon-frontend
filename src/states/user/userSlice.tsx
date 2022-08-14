import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IData {
  id: Number;
  username: String;
  access_hash: Number;
  first_name: String;
  last_name: String;
  phone: String;
  profile_pic: String;
}

export interface IUser {
  isLogin: Boolean;
  data: IData | null;
}

const initialState: IUser = {
  isLogin: false,
  data: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAuthed: (state: IUser, action: PayloadAction<IData>) => {
      state.isLogin = true;
      state.data = action.payload;
    },
    setUserLoggedOut: (state: IUser) => {
      state.isLogin = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserAuthed, setUserLoggedOut } = userSlice.actions;

export default userSlice.reducer;
