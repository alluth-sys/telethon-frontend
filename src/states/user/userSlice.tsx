import { createSlice, PayloadAction, current, Dictionary } from "@reduxjs/toolkit";

export interface IData {
  id: number;
  username: string;
  access_hash: number;
  first_name: string;
  last_name: string;
  phone: string;
  profile_pic: string;
}

export interface IUser {
  isLogin: Boolean;
  data: IData | null;
  friendList: FriendList;
  timeList: Array<Friend>;
  timeListIndex: number;
  focus: number;
}

export type Message =  {
  tag: string;
  channel: number;
  from: string;
  data: string;
  message_id: number;
  time_stamp: string;
}

export type Friend =  {
  channel_id: number;
  username: string;
  profile_b64: string;
  unread_count: number;
  last_message: Message|null;
  chat_history: Dictionary<Message>;
  oldest_message_id: number;
  priority: number;
}

export type FriendList = {
  [id :number]: Friend
}

const initialState: IUser = {
  isLogin: false,
  data: null,
  friendList: {
    0: {
      channel_id: 0,
      username: "-1",
      profile_b64: "-1",
      unread_count: -1,
      last_message: null,
      chat_history: { "0": {tag:"null",channel:-1,from:"null",data:"null",message_id:-1,time_stamp:"null"} },
      oldest_message_id : -1,
      priority: -1
    },
  },
  timeList: [],
  timeListIndex: 0,
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
      const channel : number = action.payload.channel
      const message_id : number = action.payload.message_id
      state.friendList[channel].chat_history[
        message_id
      ] = action.payload;

      // update the latest message
      state.friendList[action.payload.channel].last_message =
        action.payload.data;

      return state;
    },
    setFriendChatHistory: (state: IUser, action) => {
      // append in chat history
      for (let i = 0; i < action.payload.data.context.length; i++) {
        const newhistory = {
          ...state.friendList[action.payload.data.context[0].channel]
            .chat_history,
          [action.payload.data.context[i].message_id]:
            action.payload.data.context[i],
        };
        state.friendList[action.payload.data.context[0].channel].chat_history =
          newhistory;
        if (i == action.payload.data.context.length - 1) {
          state.friendList[
            action.payload.data.context[0].channel
          ].oldest_message_id = action.payload.data.context[i].message_id;
        }
      }

      return state;
    },
    setUserFocus: (state: IUser, action) => {
      state.focus = action.payload;
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
} = userSlice.actions;

export default userSlice.reducer;
