import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageArea from "./MessageArea/MessageArea";

import WebFont from "webfontloader";
import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import * as React from "react"
import { setUserShowContextMenu } from "@/states/user/userSlice";
import "./Chat.css";
import Collapse from '@mui/material/Collapse';
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

export default function chat() {
  // state need to be organized :
  //  select:
  //    userid
  //  dispatch:
  //    channel_id

  const focus = useAppSelector((state) => state.user.focus);
  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);

  const dispatch = useAppDispatch();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Inter"],
      },
    });
  }, []);

  const handleClickOut = useCallback(() => {
    showContextMenu ? dispatch(setUserShowContextMenu(false)) : null;
  }, [showContextMenu]);

  const [collapsed, setCollapse] = useState(true);

  return (
    <div
      className="flex grow justify-start"
      onClick={() => {
        handleClickOut();
      }}
    >
      <div className=" grid" >
        <Collapse in={collapsed} collapsedSize={0} orientation="horizontal">
            <FriendList />
        </Collapse>
      </div>
      <div className="grow grid content-end ">
        <div
          className="flex flex-col  grow w-full "
          style={{ height: "85vh", position: "static" }}
          id="messageAreaWrapper"
        >
          
        <IconButton onClick={() => setCollapse(!collapsed)} style={{height:"5vh" , width:"50px"}}>
              {collapsed&&<ChevronLeft />||<ChevronRight/> }
        </IconButton>
          <MessageArea focus={focus} />
        </div>
        <div className="grid h-15vh">
          <InputArea />
        </div>
      </div>
    </div>
  );
}
