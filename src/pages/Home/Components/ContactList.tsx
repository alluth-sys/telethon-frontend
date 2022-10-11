import React from "react";
import IconButton from "@mui/material/IconButton";
import PeopleIcon from "@mui/icons-material/People";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function ContactList() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className="absolute top-10 right-10 bg-gray-800 rounded-2xl hover:bg-blue-500 transition-all duration-200 ease-linear
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
      >
        <MenuItem onClick={handleClose}>Friend 1</MenuItem>
        <MenuItem onClick={handleClose}>Friend 2</MenuItem>
        <MenuItem onClick={handleClose}>Friend 3</MenuItem>
      </Menu>
    </div>
  );
}
