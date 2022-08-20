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
  friendList : Object;
}

const initialState: IUser = {
  isLogin: false,
  data: null,
  friendList : {},
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
    setUserFriendList: (state:IUser, action)=>{
      console.log(action.payload)
      state.friendList[action.payload.channel] = action.payload.count
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUserAuthed, setUserLoggedOut,setUserFriendList } = userSlice.actions;

export default userSlice.reducer;
