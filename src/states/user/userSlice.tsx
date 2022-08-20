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
  friendList: Object;
}

interface Friend {
  id: Number;
  username: String;
  profile_b64: String;
  unread_count: Number;
}

const initialState: IUser = {
  isLogin: false,
  data: null,
  friendList: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAuthed: (state: IUser, action: PayloadAction<IData>) => {
      state.isLogin = true;
      state.data = action.payload;
      console.log(state.data);
    },
    setUserLoggedOut: (state: IUser) => {
      state.isLogin = false;
    },
    setUserFriendList: (state: IUser, action) => {
      console.log(action.payload);
      let obj = {
        userid: action.payload.id,
        username: action.payload.name,
        profile_b64: action.payload.b64,
        unread_count: action.payload.unread_count,
        last_message_tag: action.payload.last_message_tag,
        last_message: action.payload.last_message,
      };
      state.friendList[action.payload.id] = obj;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserAuthed, setUserLoggedOut, setUserFriendList } =
  userSlice.actions;

export default userSlice.reducer;
