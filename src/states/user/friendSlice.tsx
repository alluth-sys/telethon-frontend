import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { Message } from "@/states/user/userSlice";

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
    incrementUnreads: (state: IData, action: PayloadAction<Message>) => {
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

export const { setFriendData, incrementUnreads } = friendSlice.actions;

export default friendSlice.reducer;
