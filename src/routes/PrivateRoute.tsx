import React from "react";
// Router
import { Navigate, Outlet } from "react-router-dom";

// Side Bar
import SideBar from "@/components/SideBar";

// Types
import { IUser } from "@/states/user/userSlice";

// Socket
import { SocketContext } from "@/service/Socket";

// SnackBar
import ConnectionSnackBar from "@/components/ConnectionSnackBar";

export default function PrivateRoute({ isLogin, data }: IUser) {
  const socket = React.useContext(SocketContext);
  const listenon = React.useRef(true)



  if (!isLogin && data === null) {
    console.log("private Route",listenon.current);
    socket.on("message", (msg) => {console.log(msg)});
    listenon.current = false
    console.log(listenon.current)
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="flex">
      <SideBar />
      <Outlet />
      <ConnectionSnackBar />
    </div>
  );
}
