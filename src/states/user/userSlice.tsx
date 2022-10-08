import { store } from "@/app/store";
import { createSlice, Dictionary } from "@reduxjs/toolkit";

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
  isLogin: boolean;
  data: IData | null;
  friendList: FriendList;
  timeList: Array<number>;
  timeListIndex: number;
  focus: number;
  showContextMenu: boolean;
  contextMenuAnchorPoint: Dictionary<number>;
  selectedMessageId: Array<number>;
  importantMessages: Dictionary<Message>;
}

export type Message = {
  tag: string;
  channel_id: number;
  from: string;
  sender_id: number;
  data: string;
  message_id: number;
  timestamp: string;
};

export type Friend = {
  channel_id: number;
  username: string;
  profile_b64: string;
  unread_count: number;
  last_message: Message | null;
  chat_history: Dictionary<Message>;
  oldest_message_id: number;
  priority: number;
  initialized_chat: Boolean;
};

export type FriendList = {
  [id: number]: Friend;
};

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
      chat_history: {
        "0": {
          tag: "null",
          channel_id: -1,
          from: "null",
          sender_id: -1,
          data: "null",
          message_id: -1,
          timestamp: "null",
        },
      },
      oldest_message_id: -1,
      priority: -1,
      initialized_chat: false,
    },
  },
  timeList: [],
  timeListIndex: 0,
  focus: 0,
  showContextMenu: false,
  contextMenuAnchorPoint: { x: 0, y: 0 },
  selectedMessageId: [],
  importantMessages: {
    "0": {
      tag: "null",
      channel_id: -1,
      from: "null",
      sender_id: -1,
      data: "null",
      message_id: -1,
      timestamp: "null",
    },
  },
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
    setUserLoggedOut: (state) => {},
    updateUserName: (state: IUser, action) => {
      state.data!.first_name = action.payload.firstname;
      state.data!.last_name = action.payload.lastname;
      return state;
    },
    updateUsername: (state: IUser, action) => {
      state.data!.username = action.payload.uname;
      return state;
    },
    updateUserProfile: (state: IUser, action) => {
      state.data!.profile_pic = action.payload.image;
      return state;
    },
    setUserFriendList: (state: IUser, action) => {
      // console.log("set user friend list");
      let friend: Friend = {
        channel_id: action.payload.channel,
        username: action.payload.name,
        profile_b64: action.payload.b64,
        unread_count: action.payload.unread_count,
        last_message: action.payload.last_message,
        chat_history: {},
        oldest_message_id: 0,
        priority: action.payload.priority,
        initialized_chat: false,
      };
      state.friendList[action.payload.channel] = friend;

      state.timeList[state.timeListIndex] = friend.channel_id;
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
        (element) => element == action.payload.channel
      );

      // send back the priority of the messages' timestamp
      const timeList0 = state.timeList[index];
      for (let i = index; i > 0; i--) {
        state.timeList[i] = state.timeList[i - 1];
      }
      // set the incoming message as top
      // timeList0.last_message = action.payload;
      state.timeList[0] = timeList0;

      // append in chat history
      const channel: number = action.payload.channel;
      const message_id: number = action.payload.message_id;
      state.friendList[channel].chat_history[message_id] = action.payload;

      // update the latest message
      state.friendList[action.payload.channel].last_message = action.payload;

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
    setUserFreindListInitialized: (state, { payload }) => {
      state.friendList[payload].initialized_chat = true;
      return state;
    },
    setUserShowContextMenu: (state, action) => {
      state.showContextMenu = action.payload;
      return state;
    },
    setUserContextMenuAnchorPoint: (state, action) => {
      state.contextMenuAnchorPoint.x = action.payload.x;
      state.contextMenuAnchorPoint.y = action.payload.y;
      return state;
    },
    updateFriendUnreadCount: (state, action) => {
      console.log(action.payload);
      state.friendList[action.payload.data.context.channel_id].unread_count = 0;
      return state;
    },
    updateFriendPriority: (state, action) => {
      state.friendList[action.payload.channel_id].priority =
        action.payload.priority;
      return state;
    },
    setSelectedMessageId: (state, action) => {
      if (action.payload.reset != undefined) {
        state.selectedMessageId = initialState.selectedMessageId;
        return state;
      }
      state.selectedMessageId = action.payload.message_id;
      return state;
    },
    setImportantMessages: (state, action) => {
      let message: Message = {
        tag: "null",
        channel_id: -1,
        from: "null",
        sender_id: -1,
        data: "null",
        message_id: -1,
        timestamp: "null",
      };
      if (action.payload.channel_id != undefined) {
        message =
          state.friendList[action.payload.channel_id].chat_history[
            action.payload.message_id
          ];
      } else {
        return state;
      }
      state.importantMessages[
        `${action.payload.channel_id}_${action.payload.message_id}`
      ] = message;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserAuthed,
  setUserLoggedOut,
  updateUserName,
  updateUsername,
  updateUserProfile,
  setUserFriendList,
  setFriendLatestMessage,
  setFriendChatHistory,
  setUserFocus,
  setUserFreindListInitialized,
  setUserShowContextMenu,
  setUserContextMenuAnchorPoint,
  updateFriendUnreadCount,
  updateFriendPriority,
  setSelectedMessageId,
  setImportantMessages,
} = userSlice.actions;

export default userSlice.reducer;
