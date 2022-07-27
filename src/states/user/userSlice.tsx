import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IData {
  id: Number;
  username: String;
  access_hash: Number;
  first_name: String;
  last_name: String;
  phone: String;
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
    setUserAuthed: (state: IUser) => {
      state.isLogin = true;
    },
    setUserData: (state: IUser, action: PayloadAction<IData>) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserAuthed, setUserData } = userSlice.actions;

export default userSlice.reducer;
