import SideBar from "../../components/SideBar";
import { useSelector } from "react-redux";

export default function Home() {
  const isLogin = useSelector((state: any) => state.user.isLogin);
  console.log(isLogin);
  return (
    <div className="flex">
      <SideBar />
      <div className="w-full">Home</div>
    </div>
  );
}
