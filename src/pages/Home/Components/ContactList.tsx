import React from "react";
import IconButton from "@mui/material/IconButton";
import PeopleIcon from "@mui/icons-material/People";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import ContactProfile from "./ContactProfile";
import useFriendList from "../Hooks/useFriendList";

import { setUserFocus } from "@/states/user/userSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";

export default function ContactList() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { friendData } = useFriendList();

  if (!friendData) return null;

  return (
    <div
      className="absolute top-5 right-10 bg-gray-800 rounded-2xl hover:bg-blue-500 transition-all duration-200 ease-linear
        cursor-pointer shadow-lg sidebar-icon group"
    >
      <div className="contact-tooltip group-hover:scale-100">Contacts</div>
      <IconButton sx={{ color: "white" }} onClick={handleClick}>
        <PeopleIcon fontSize="large" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {friendData.map((friend, index) => {
          return (
            <MenuItem
              onClick={() => {
                handleClose();
                dispatch(setUserFocus(friend.id));
                navigate("/chat");
              }}
              key={index}
            >
              <ContactProfile
                b64={friend.b64}
                name={friend.name}
                id={parseInt(friend.id)}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
