import React from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { BASE } from "@/constants/endpoints";

export const socket: Socket = io(BASE, {
  transports: ["websocket", "polling", "flashsocket"],
});

export const SocketContext = React.createContext(socket);
