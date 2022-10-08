import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  },
});

export const { setFriendData } = friendSlice.actions;

export default friendSlice.reducer;
