// Icons
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import TelegramIcon from "@mui/icons-material/Telegram";
import LogoutIcon from "@mui/icons-material/Logout";

type SideBarIconProps = { icon: any; text: String };

export default function SideBar() {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-16 flex flex-col
                   dark:bg-gray-900 shadow-lg text-white"
    >
      <TelegramIcon
        className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto text-white"
        fontSize="large"
      />
      <hr className="sidebar-hr" />
      <SideBarIcon icon={<HomeIcon />} text="Home" />
      <SideBarIcon icon={<ChatBubbleIcon />} text="Chat" />
      <SideBarIcon icon={<EditIcon />} text="Priority" />
      <SideBarIcon icon={<SettingsIcon />} text="Settings" />
      <hr className="sidebar-hr" />
      <div
        className="relative flex items-center justify-center h-12 w-12 mt-96 mx-auto text-white bg-gray-400 
        hover:bg-blue-500 dark:bg-gray-800 
        text-white hover:text-white
        hover:rounded-xl rounded-3xl
        transition-all duration-300 ease-linear
        cursor-pointer shadow-lg "
      >
        <LogoutIcon />
      </div>
    </div>
  );
}

const SideBarIcon: React.FC<SideBarIconProps> = ({ icon, text }) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);
