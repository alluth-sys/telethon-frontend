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
  if (!isLogin && data === null) {
    return <Navigate to="/signin" replace />;
  }

  //const socket = React.useContext(SocketContext);
  // const [isSocketConnected, setSocketConnected] = React.useState(
  //   socket.connected
  // );

  // const MINUTE_MS = 10000;
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     socket.emit("ping");
  //     socket.on("pong", (res) => {
  //       console.log(res);
  //       setSocketConnected(true);
  //     });
  //   }, MINUTE_MS);

  //   return () => {
  //     clearInterval(interval);
  //     socket.off("pong");
  //   };
  // }, []);

  return (
    <div className="flex">
      <SideBar />
      <Outlet />
      <ConnectionSnackBar />
    </div>
  );
}
