import SideBar from "../../components/SideBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const isLogin = useSelector((state: any) => state.user.isLogin);
  const navigate = useNavigate();

  // Sign in check
  useEffect(() => {
    if (!isLogin) {
      navigate("/signin");
    }
  }, []);

  return (
    <div className="flex">
      <SideBar />
      <div className="w-full">Home</div>
    </div>
  );
}
