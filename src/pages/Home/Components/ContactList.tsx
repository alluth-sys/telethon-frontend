import React from "react";
import IconButton from "@mui/material/IconButton";
import PeopleIcon from "@mui/icons-material/People";

export default function ContactList() {
  return (
    <div
      className="absolute top-10 right-10 bg-gray-800 rounded-2xl hover:bg-blue-500 transition-all duration-200 ease-linear
        cursor-pointer shadow-lg sidebar-icon group"
    >
      <div className="contact-tooltip group-hover:scale-100">Contacts</div>
      <IconButton sx={{ color: "white" }}>
        <PeopleIcon fontSize="large" />
      </IconButton>
    </div>
  );
}
