import React from "react";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";

import { setUserFocus } from "@/states/user/userSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";

type Tprops = {
  id: string;
  name: string;
  priority: number;
  b64: string;
  unread_count: number;
};

export default function UserBubble(props: Tprops) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <div
      className="w-full h-full rounded-full relative"
      onClick={() => {
        dispatch(setUserFocus(props.id));
        navigate("/chat");
      }}
    >
      <div className="w-full h-full rounded-full overflow-hidden hover:shadow-2xl transition-shadow">
        <div className="flex justify-center items-center h-full w-full transition-opacity duration-100 ease-in relative">
          <Avatar
            alt={props.name}
            src={`data:image/jpeg;base64,${props.b64}`}
            sx={{ height: "100%", width: "100%" }}
          />
          <div className="absolute w-full h-full flex justify-center items-end hover:opacity-100 opacity-0 transition-opacity">
            <div className="bg-blue-500 h-10 w-full flex justify-center items-center">
              <Typography sx={{ color: "white" }}>{props.name}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-1 right-1 rounded-full w-9 h-9 bg-red-500 flex justify-center items-center">
        <Typography sx={{ color: "white", p: 1 }}>
          {props.unread_count}
        </Typography>
      </div>
    </div>
  );
}
