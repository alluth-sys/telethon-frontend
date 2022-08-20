
import React from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const endpoint = "http://127.0.0.1:5000";


export const socket: Socket = io(endpoint, {
  transports: ["websocket", "polling", "flashsocket"],
});

export const SocketContext = React.createContext(socket);
