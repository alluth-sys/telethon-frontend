import React from "react";
// Router
import { Navigate, Outlet } from "react-router-dom";

// Side Bar
import SideBar from "../components/SideBar";

interface Props {
  isLogin: Boolean;
}

export default function PrivateRoute({ isLogin }: Props) {
  if (!isLogin) {
    return <Navigate to="/signin" replace />;
  }
  return (
    <div className="flex">
      <SideBar />
      <Outlet />
    </div>
  );
}
