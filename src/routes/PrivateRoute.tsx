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
  setUserShowContextMenu,
} from "@/states/user/userSlice";

import { IncrementUnreads } from "@/states/user/friendSlice";

// SnackBar
import ConnectionSnackBar from "@/components/Connection/ConnectionSnackBar";

import { SocketContext } from "@/service/Socket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import { BASE } from "@/constants/endpoints";

type TProps = { data: IData | null; isLogin: boolean };

export default function PrivateRoute({ isLogin, data }: TProps) {
  const dispatch = useAppDispatch();

  const user_id = useAppSelector((state) => state.user.data?.id);

  const socket = React.useContext(SocketContext);

  const handleUnload = (event: Event) => {
    console.log("unload");
    axios.get(`${BASE}/disconnect`, {
      params: {
        user_id: user_id,
      },
    });
  };

  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);

  const handleClickOut = React.useCallback(() => {
    showContextMenu ? dispatch(setUserShowContextMenu(false)) : null;
  }, [showContextMenu]);

  if (!isLogin && data === null) {
    return <Navigate to="/signin" replace />;
  }

  React.useEffect(() => {
    socket.on("message", (msg) => {
      dispatch(setFriendLatestMessage(msg));
    });
    socket.on("initial", (res) => {
      dispatch(setUserFriendList(res));
    });

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      socket.off("message");
      socket.off("initial");
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="flex" onClick={() => handleClickOut}>
      <SideBar />
      <Outlet />
      <ConnectionSnackBar />
    </div>
  );
}
