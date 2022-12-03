import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageArea from "./MessageArea/MessageArea";

import WebFont from "webfontloader";
import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { setUserShowContextMenu } from "@/states/user/userSlice";
import "./Chat.css";
import Collapse from "@mui/material/Collapse";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import ProfilePicture from "@/components/Message/ProfilePicture/ProfilePicture";
import { Typography } from "@material-ui/core";
import TopArea from "./TopArea/TopArea";

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

  const getStyle = (collpased: boolean) => {
    return {
      width: collpased ? "320px" : "0px",
    };
  };

  const handleClickOut = useCallback(() => {
    showContextMenu ? dispatch(setUserShowContextMenu(false)) : null;
  }, [showContextMenu]);

  const [collapsed, setCollapse] = useState<boolean>(true);
  return (
    <div
      className="flex grow justify-start bg-[url('./resources/bg.png')]"
      onClick={() => {
        handleClickOut();
      }}
    >
      <div className=" grid " style={getStyle(collapsed)}>
        <Collapse in={collapsed} collapsedSize={0} orientation="horizontal">
          <FriendList />
        </Collapse>
      </div>
      <div className="grow grid content-start ">
        {(
          <TopArea
            collapsed={collapsed}
            setCollapse={setCollapse}
            focus={focus}
          />
        ) || <div style={{ height: "8vh" }}></div>}
        <div
          className="flex flex-col grow w-full justify-end "
          style={{ position: "static", width: "100%", height: "78vh" }}
          id="messageAreaWrapper"
        >
          <MessageArea focus={focus} />
        </div>
        <div className="grid " style={{ height: "10vh" }}>
          <InputArea />
        </div>
      </div>
    </div>
  );
}
