import React from "react";
// Router
import { Navigate, Outlet } from "react-router-dom";

// Side Bar
import SideBar from "@/components/SideBar";

// Types
import { IData } from "@/states/user/userSlice";

// SnackBar
import ConnectionSnackBar from "@/components/ConnectionSnackBar";

type TProps = { data: IData | null; isLogin: boolean };

export default function PrivateRoute({ isLogin, data }: TProps) {
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
