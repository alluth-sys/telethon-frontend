import React from "react";
// Router
import { Navigate, Outlet } from "react-router-dom";

// Side Bar
import SideBar from "@/components/SideBar";

// Types
import {
  IData,
  setFriendLatestMessage,
  setUserFriendList,
} from "@/states/user/userSlice";

import { IncrementUnreads } from "@/states/user/friendSlice";

// SnackBar
import ConnectionSnackBar from "@/components/Connection/ConnectionSnackBar";

import { SocketContext } from "@/service/Socket";
import { useAppDispatch } from "@/app/hooks";

type TProps = { data: IData | null; isLogin: boolean };

export default function PrivateRoute({ isLogin, data }: TProps) {
  const dispatch = useAppDispatch();

  const socket = React.useContext(SocketContext);
  if (!isLogin && data === null) {
    return <Navigate to="/signin" replace />;
  }

  React.useEffect(() => {
    socket.on("message", (msg) => {
      // dispatch(IncrementUnreads(msg));
      dispatch(setFriendLatestMessage(msg));
    });
    socket.on("initial", (res) => {
      // console.log(res);
      dispatch(setUserFriendList(res));
    });

    return () => {
      socket.off("message");
      socket.off("initial");
    };
  }, []);

  return (
    <div className="flex">
      <SideBar />
      <Outlet />
      <ConnectionSnackBar />
    </div>
  );
}
