import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

export interface IFriend {
  id: string;
  name: string;
  priority: number;
  b64: string;
  unread_count: number;
}
interface IData {
  data: IFriend[] | undefined;
}

interface IncomingMessage {
  channel_id: number;
  content: string;
  from: string;
  message_id: number;
  sender_id: number;
  tag: string;
  timestamp: string;
}

const initialState: IData = {
  data: undefined,
};

export const friendSlice = createSlice({
  name: "friendData",
  initialState,
  reducers: {
    setFriendData: (state: IData, action: PayloadAction<IData>) => {
      state.data = action.payload.data;
      return state;
    },
    IncrementUnreads: (
      state: IData,
      action: PayloadAction<IncomingMessage>
    ) => {
      console.log("increment triggered");
      const index = state.data?.findIndex(
        (friend) => parseInt(friend.id) === action.payload.sender_id
      );
      // @ts-ignore
      const newArray: IFriend[] = state.data;

      // @ts-ignore
      newArray[index].unread_count += 1;
      state.data = newArray;
      return state;
    },
  },
});

export const { setFriendData, IncrementUnreads } = friendSlice.actions;

export default friendSlice.reducer;
