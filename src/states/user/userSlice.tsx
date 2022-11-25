import { store } from "@/app/store";
import _ from "lodash";
import { createSlice, Dictionary, current } from "@reduxjs/toolkit";

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
  filterShowRank: string;
  friendList: FriendList;
  timeList: Array<number>;
  timeListIndex: number;
  focus: number;
  showContextMenu: boolean;
  contextMenuAnchorPoint: { x: number; y: number };
  selectedMessageId: Array<string>;
  importantMessages: Dictionary<Message>;
}

export type Message = {
  tag: string;
  channel_id: number;
  sender_name: string;
  sender_id: number;
  content: string;
  message_id: number | string;
  timestamp: string;
  isImportant: boolean;
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
  pinned_message: { message_id: number; context: string };
  participants: Dictionary<string>;
};

export type FriendList = {
  [id: number]: Friend;
};

const initailFriend: Friend = {
  channel_id: 0,
  username: "-1",
  profile_b64: "-1",
  unread_count: -1,
  last_message: null,
  chat_history: {
    "0": {
      tag: "null",
      channel_id: -1,
      sender_name: "null",
      sender_id: -1,
      content: "null",
      message_id: -1,
      timestamp: "null",
      isImportant: false,
    },
  },
  oldest_message_id: -1,
  priority: -1,
  initialized_chat: false,
  pinned_message: { message_id: -1, context: "" },
  participants: {},
};

const initailMessage: Message = {
  tag: "null",
  channel_id: -1,
  sender_name: "null",
  sender_id: -1,
  content: "null",
  message_id: -1,
  timestamp: "null",
  isImportant: false,
};

const initialState: IUser = {
  isLogin: false,
  data: null,
  friendList: {
    0: initailFriend,
  },
  filterShowRank: "All",
  timeList: [],
  timeListIndex: 0,
  focus: 0,
  showContextMenu: false,
  contextMenuAnchorPoint: { x: 0, y: 0 },
  selectedMessageId: [],
  importantMessages: {
    "0": initailMessage,
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
    setFilterShowRank: (state: IUser, action) => {
      state.filterShowRank = action.payload.rank;
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
        oldest_message_id: -1,
        priority: action.payload.priority,
        initialized_chat: false,
        pinned_message: { message_id: -1, context: "" },
        participants: { ...action.payload.participants },
      };
      state.friendList[action.payload.channel] = friend;

      if (state.timeList.findIndex((ele) => ele == friend.channel_id) == -1) {
        state.timeList[state.timeListIndex] = friend.channel_id;
      }
      state.timeListIndex++;
      return state;
    },
    setFriendLatestMessage: (state: IUser, action) => {
      if (action.payload.data !== undefined) {
        action.payload = action.payload.data.context;
      }

      // append in chat history
      const channel: number = action.payload.channel_id;
      const message_id: number = action.payload.message_id;

      if (state.friendList[channel] != undefined) {
        // get the channel id of the incoming message
        const index = state.timeList.findIndex(
          (element) => element == action.payload.channel_id
        );

        // send back the order of other messages'
        const timeList0 = state.timeList[index];
        for (let i = index; i > 0; i--) {
          state.timeList[i] = state.timeList[i - 1];
        }
        // set the incoming message as the first order
        state.timeList[0] = timeList0;
        const message = { ...action.payload, isImportant: false };
        state.friendList[channel].chat_history[message_id] = message;

        // update the latest message
        state.friendList[channel].last_message = action.payload;
      } else {
        var tempFriend: Friend = { ...initailFriend };
        tempFriend.username = "";
        tempFriend.channel_id = channel;
        tempFriend.last_message = action.payload;
        tempFriend.unread_count = 1;
        state.friendList[channel] = tempFriend;

        var inline = function () {
          state.timeList[state.timeListIndex] =
            state.timeList[state.timeListIndex - 1];
          state.timeListIndex++;
          for (let i = state.timeList.length - 1; i > 0; i--) {
            state.timeList[i] = state.timeList[i - 1];
          }
          state.timeList[0] = channel;
        };
        inline();
      }

      state.timeList = _.compact(state.timeList);
      state.timeList = _.difference(state.timeList);

      return state;
    },
    setFriendChatHistory: (state: IUser, action) => {
      // append in chat history
      const channel_id = action.payload.data.context[0].channel_id;

      for (let i = 0; i < action.payload.data.context.length; i++) {
        const message_id = action.payload.data.context[i].message_id;
        const message: Message = {
          ...action.payload.data.context[i],
          isImportant: false,
        };
        if (
          state.friendList[channel_id].chat_history[message_id] == undefined
        ) {
          const newhistory = {
            ...state.friendList[channel_id].chat_history,
            [message_id]: message,
          };
          state.friendList[channel_id].chat_history = newhistory;
        }
        if (state.friendList[channel_id].oldest_message_id > message_id || state.friendList[channel_id].oldest_message_id === -1) {
          state.friendList[channel_id].oldest_message_id = message_id;
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
      let message: Message | undefined = initailMessage;
      // the action is dispatched by local change
      if (action.payload.channel_id != undefined) {
        state.friendList[action.payload.channel_id].chat_history[
          action.payload.message_id
        ]!.isImportant = true;

        message =
          state.friendList[action.payload.channel_id].chat_history[
            action.payload.message_id
          ];
        state.importantMessages[
          `${action.payload.channel_id}_${action.payload.message_id}`
        ] = message;
        return state;
      } else {
        // the action is dispatched by endpoint
        for (let i = 0; i < action.payload.data.context.length; i++) {
          let message: Message = {
            ...action.payload.data.context[i],
            isImportant: true,
          };
          message.message_id = `${action.payload.data.context[i].channel_id}_${action.payload.data.context[i].message_id}`;
          state.importantMessages[
            `${action.payload.data.context[i].channel_id}_${action.payload.data.context[i].message_id}`
          ] = message;

          if (
            state.friendList[action.payload.data.context[i].channel_id] !=
            undefined
          ) {
            state.friendList[
              action.payload.data.context[i].channel_id
            ].chat_history[action.payload.data.context[i].message_id] = {
              ...action.payload.data.context[i],
              isImportant: true,
            };
          } else {
            var tempFriend: Friend = { ...initailFriend };
            tempFriend.channel_id = action.payload.data.context[i].channel_id;
            tempFriend.chat_history[action.payload.data.context[i].message_id] =
              { ...action.payload.data.context[i], isImportant: true };
            state.friendList[action.payload.data.context[i].channel_id] =
              tempFriend;
          }
        }
        return state;
      }
    },
    removeImportantMessages: (state, action) => {
      delete state.importantMessages[action.payload.message_id];
      return state;
    },
    setFriendPinnedMessage: (state, action) => {
      state.friendList[action.payload.friend_id].pinned_message.message_id =
        action.payload.payload.message_id;
      state.friendList[action.payload.friend_id].pinned_message.context =
        action.payload.payload.context;

      return state;
    },
    deleteFriendMessage: (state, action) => {
      delete state.friendList[action.payload.friend_id].chat_history[
        action.payload.message_id
      ];

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
  removeImportantMessages,
  setFriendPinnedMessage,
  deleteFriendMessage,
  setFilterShowRank,
} = userSlice.actions;

export default userSlice.reducer;
