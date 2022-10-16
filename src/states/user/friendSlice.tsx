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
  tag: string;
  channel: number;
  sender_id: number;
  from: string;
  data: any;
  message_id: number;
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
