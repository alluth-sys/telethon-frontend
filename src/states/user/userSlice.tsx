import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

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
  set: Boolean;
  focus: number;
}

export interface Friend {
  channel_id : number,
  username: string,
  profile_b64 : string,
  unread_count : number,
  last_message_tag : string,
  last_message : string,
  last_message_timestamp : string,
  chat_history : object,
  oldest_message_id: number
} 

const initialState: IUser = {
  isLogin: false,
  data: null,
  friendList: {
    "0":{
    channel_id:null,
    username:null,
    profile_b64:null,
    }
  },
  set: true,
  focus: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAuthed: (state: IUser, action) => {
      state.isLogin = true;
      state.data = action.payload.context;
      console.log(state.data);
      
    },
    setUserLoggedOut: (state: IUser) => {
      state.isLogin = false;
    },
    setUserFriendList: (state: IUser, action) => {
      let friend : Friend = {
        channel_id: action.payload.channel,
        username: action.payload.name,
        profile_b64: action.payload.b64,
        unread_count: action.payload.unread_count,
        last_message_tag: action.payload.last_message_tag,
        last_message: action.payload.last_message,
        last_message_timestamp: action.payload.last_message_timestamp,
        chat_history: {},
        oldest_message_id: 0,
      };

      state.friendList[action.payload.channel] = friend;
    },
    setFriendLatestMessage: (state: IUser, action) => {
      console.log("incoming msg");
      // append in chat history
      state.friendList[action.payload.channel].chat_history[
        action.payload.message_id
      ] = action.payload;

      // update the latest message
      state.friendList[action.payload.channel].last_message =
        action.payload.data;
      state.friendList[action.payload.channel].last_message_tag =
        action.payload.tag;

      state.set = true
    },
    setFriendChatHistory: (state: IUser, action) => {
      // append in chat history
      for (let i = 0; i < action.payload.data.context.length; i++) {
        state.friendList[action.payload.data.context[0].channel].chat_history[
          action.payload.data.context[i].message_id
        ] = action.payload.data.context[i];
        if (i == action.payload.data.context[0].length - 1) {
          state.friendList[
            action.payload.data.context[0].channel
          ].oldest_message_id = action.payload.data.context[i].message_id;
        }
      }

      state.set = true

    },
    setUserFocus: (state: IUser, action) => {
      state.focus = action.payload;
    },
    setUserSet : (state: IUser, action)=>{
      console.log("set set to " , action.payload)
      state.set = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserAuthed,
  setUserLoggedOut,
  setUserFriendList,
  setFriendLatestMessage,
  setFriendChatHistory,
  setUserFocus,
  setUserSet,
} = userSlice.actions;

export default userSlice.reducer;
