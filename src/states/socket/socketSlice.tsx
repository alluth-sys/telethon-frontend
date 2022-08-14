import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const endpoint = "http://127.0.0.1:5000";

export interface ISocket {
  websocket: Socket | null;
}

const initialState: ISocket = {
  websocket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    onConnection: (state: any) => {
      state.websocket = io(endpoint, {
        transports: ["websocket", "polling", "flashsocket"],
      })
        .on("connect", () => {
          console.log("socket connected");
        })
        .on("message", (message) => {
          console.log(message);
        })
        .on("disconnect", () => {
          alert("disconnect");
          console.log("disconnect");
          location.reload();
        });
    },
  },
});

// Action creators are generated for each case reducer function
export const { onConnection } = socketSlice.actions;

export default socketSlice.reducer;