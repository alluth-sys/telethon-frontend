// Router
import { Navigate, Outlet } from "react-router-dom";

// Side Bar
import SideBar from "@/components/SideBar";

// Types
import { IUser } from "@/states/user/userSlice";

export default function PrivateRoute({ isLogin, data }: IUser) {
  if (!isLogin && data === null) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="flex">
      <SideBar />
      <Outlet />
    </div>
  );
}
