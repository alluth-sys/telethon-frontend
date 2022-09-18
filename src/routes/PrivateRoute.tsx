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
import { useAppSelector } from "@/app/hooks";

export default function PrivateRoute({
  isLogin,
  data,
  friendList,
  timeList,
  timeListIndex,
  focus,
}: IUser) {
  const socket = React.useContext(SocketContext);
  // const {data} = useAppSelector(state=>state.user)

  if (!isLogin && data === null) {
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
