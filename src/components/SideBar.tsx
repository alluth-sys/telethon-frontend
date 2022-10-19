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

// i18n
import { useTranslation } from "react-i18next";

type SideBarIconProps = { icon: any; text: String; path: String };

export default function SideBar() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const SignOutHandler = () => {
    axios
      .post(`${BASE}/logout`, {
        uid: UserData?.id,
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
      className=" sticky top-0 left-0 h-screen w-16 flex flex-col
                   dark:bg-gray-900 shadow-lg text-white "
    >
      <TelegramIcon
        className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto text-white"
        fontSize="large"
      />
      <hr className="sidebar-hr" />
      <SideBarIcon icon={<HomeIcon />} text={t("Home")} path="/home" />
      <SideBarIcon icon={<ChatBubbleIcon />} text={t("Chat")} path="/chat" />
      <SideBarIcon icon={<EditIcon />} text={t("Priority")} path="/priority" />
      <SideBarIcon
        icon={<SettingsIcon />}
        text={t("Settings")}
        path="/settings"
      />
      <hr className="sidebar-hr" />
      <div className="h-4/6 flex items-end">
        <div onClick={SignOutHandler} className="sidebar-icon group">
          <LogoutIcon />
          <span className="sidebar-tooltip group-hover:scale-100">Logout</span>
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
