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
  timeList: Array<Friend>;
  timeListIndex: number;
  set: Boolean;
  focus: number;
}

export interface Messaege {
  tag: string;
  channel: number;
  from: string;
  data: string;
  message_id: number;
  time_stamp: string;
}

export interface Friend {
  channel_id: number;
  username: string;
  profile_b64: string;
  unread_count: number;
  last_message: object;
  chat_history: object;
  oldest_message_id: number;
  priority: number;
}

const initialState: IUser = {
  isLogin: false,
  data: null,
  friendList: {
    "0": {
      channel_id: null,
      username: null,
      profile_b64: null,
      chat_history: { "0": "dummy" },
    },
  },
  timeList: [],
  timeListIndex: 0,
  set: true,
  focus: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAuthed: (state: IUser, action) => {
      state.isLogin = true;
      state.data = action.payload;
      return state;
    },
    setUserLoggedOut: (state: IUser) => {
      state.isLogin = false;
      return state;
    },
    setUserFriendList: (state: IUser, action) => {
      let friend: Friend = {
        channel_id: action.payload.channel,
        username: action.payload.name,
        profile_b64: action.payload.b64,
        unread_count: action.payload.unread_count,
        last_message: action.payload.last_message,
        chat_history: {},
        oldest_message_id: 0,
        priority: action.payload.priority,
      };
      state.friendList[action.payload.channel] = friend;
      state.timeList[state.timeListIndex] = friend;
      state.timeListIndex++;

      return state;
    },
    setFriendLatestMessage: (state: IUser, action) => {
      console.log("incoming msg", action.payload);
      if (action.payload.data.context !== undefined) {
        action.payload = action.payload.data.context;
      }
      // get the channel id of the incoming message
      const index = state.timeList.findIndex(
        (element) => element.channel_id == action.payload.channel
      );

      // send back the priority of the messages' timestamp
      const timeList0 = state.timeList[index];
      for (let i = index; i > 0; i--) {
        state.timeList[i] = state.timeList[i - 1];
      }
      // set the incoming message as top
      timeList0.last_message = action.payload;
      state.timeList[0] = timeList0;

      // append in chat history
      state.friendList[action.payload.channel].chat_history[
        action.payload.message_id
      ] = action.payload;

      // update the latest message
      state.friendList[action.payload.channel].last_message =
        action.payload.data;

      if(action.payload.channl === state.focus){
        console.log(action.payload.channel , state.focus)
        state.set = true;
      }

      return state;
    },
    setFriendChatHistory: (state: IUser, action) => {
      // append in chat history
      for (let i = 0; i < action.payload.data.context.length; i++) {
        // state.friendList[action.payload.data.context[0].channel].chat_history[
        //   action.payload.data.context[i].message_id
        // ] = action.payload.data.context[i];
        // if (i == action.payload.data.context.length - 1) {
        //   state.friendList[
        //     action.payload.data.context[0].channel
        //   ].oldest_message_id = action.payload.data.context[i].message_id;
        // }
        const newhistory = {...state.friendList[action.payload.data.context[0].channel].chat_history,[action.payload.data.context[i].message_id]:action.payload.data.context[i]}
        console.log(newhistory)
        state.friendList[action.payload.data.context[0].channel].chat_history = newhistory
        if (i == action.payload.data.context.length - 1) {
            state.friendList[
              action.payload.data.context[0].channel
            ].oldest_message_id = action.payload.data.context[i].message_id;
          }
      }

      

      state.set = true;

      return state;
    },
    setUserFocus: (state: IUser, action) => {
      state.focus = action.payload;
      return state;
    },
    setUserSet: (state: IUser, action) => {
      console.log("set set to ", action.payload);
      state.set = action.payload;
      return state;
    },
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
