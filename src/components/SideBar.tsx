// Icons
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import TelegramIcon from "@mui/icons-material/Telegram";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { RootState } from "@/app/store";
import axios from "axios";
import { setUserLoggedOut } from "@/states/user/userSlice";

// Router
import { useNavigate } from "react-router-dom";

// Endpoint
import { BASE } from "@/constants/endpoints";

type SideBarIconProps = { icon: any; text: String; path: String };

export default function SideBar() {
  const UserData = useAppSelector((state: RootState) => state.user.data);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const SignOutHandler = () => {
    axios
      .post(`${BASE}/logout`, {
        phone: "+" + UserData?.phone,
      })
      .then((res) => {
        console.log(res);
        dispatch(setUserLoggedOut());
        localStorage.clear();
        navigate("/signin");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div
      className="static top-0 left-0 h-screen w-16 flex flex-col
                   dark:bg-gray-900 shadow-lg text-white"
    >
      <TelegramIcon
        className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto text-white"
        fontSize="large"
      />
      <hr className="sidebar-hr" />
      <SideBarIcon icon={<HomeIcon />} text="Home" path="/home" />
      <SideBarIcon icon={<ChatBubbleIcon />} text="Chat" path="/chat" />
      <SideBarIcon icon={<EditIcon />} text="Priority" path="/priority" />
      <SideBarIcon icon={<SettingsIcon />} text="Settings" path="/settings" />
      <hr className="sidebar-hr" />
      <div
        className="relative flex items-center justify-center h-12 w-12 mt-96 mx-auto 
        text-white bg-gray-400 
        hover:bg-blue-500 dark:bg-gray-800 hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg "
      >
        <div onClick={SignOutHandler}>
          <LogoutIcon />
        </div>
      </div>
    </div>
  );
}

const SideBarIcon: React.FC<SideBarIconProps> = ({ icon, text, path }) => {
  const navigate = useNavigate();
  return (
    <div
      className="sidebar-icon group"
      onClick={() => {
        // @ts-ignore
        navigate(path);
      }}
    >
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
};
