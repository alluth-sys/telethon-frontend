import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageArea from "./MessageArea/MessageArea";

import WebFont from "webfontloader";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { setUserShowContextMenu } from "@/states/user/userSlice";
import "./Chat.css";

export function scrollBarAnimation() {
  var curr = document.getElementById("messageArea");
  curr!.className = "scrolling-class grid";
  setTimeout(() => {
    curr!.className = "message-area-scrollbar grid";
  }, 1000);
}

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
    console.log("chat click", showContextMenu);
    showContextMenu ? dispatch(setUserShowContextMenu(false)) : null;
  }, [showContextMenu]);

  return (
    <div
      className="flex grow justify-start"
      onClick={() => {
        handleClickOut();
      }}
    >
      <div className="flex" style={{ width: "320px" }}>
        <FriendList />
      </div>
      <div className="grow grid content-end ">
        <div
          className="flex flex-col  grow w-full "
          style={{ height: "85vh" }}
          id="messageAreaWrapper"
        >
          <MessageArea focus={focus} />
        </div>
        <div className="grid h-15vh">
          <InputArea />
        </div>
      </div>
    </div>
  );
}
