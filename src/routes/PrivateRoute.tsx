import React from "react";
// Router
import { Navigate, Outlet } from "react-router-dom";

// Side Bar
import SideBar from "@/components/SideBar";

// Actions
import {
  IData,
  setFriendLatestMessage,
  setUserFriendList,
  setUserShowContextMenu,
} from "@/states/user/userSlice";

import { incrementUnreads } from "@/states/user/friendSlice";

// SnackBar
import ConnectionSnackBar from "@/components/Connection/ConnectionSnackBar";

// Socket
import { SocketContext } from "@/service/Socket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";

// Notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { access_token_header } from "@/constants/access_token";

type TProps = { data: IData | null; isLogin: boolean };

export default function PrivateRoute({ isLogin, data }: TProps) {
  const dispatch = useAppDispatch();

  const user_id = useAppSelector((state) => state.user.data?.id);

  const socket = React.useContext(SocketContext);

  const handleUnload = async () => {
    socket.close();
    try {
      await axios.get(`${BASE}/disconnect`, {
        params: {
          user_id: user_id,
        },
        headers: access_token_header(),
      });
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
    }
  };

  const notify = (sender: string, content: string) => {
    toast.dark(
      ({ closeToast }) => {
        return (
          <div>
            <span className="text-lime-500">{sender}: </span>
            <span className="overflow-hidden">{content}</span>
          </div>
        );
      },
      {
        pauseOnHover: false,
        hideProgressBar: true,
      }
    );
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
      dispatch(incrementUnreads(msg));
      dispatch(setFriendLatestMessage(msg));
      notify(msg.from, msg.content);
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
      <ToastContainer autoClose={1000} />
    </div>
  );
}
