import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageBox from "@/components/MessageBox/MessageBox";

import WebFont from "webfontloader";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { setUserShowContextMenu } from "@/states/user/userSlice";

import { setUserFreindListInitialized } from "@/states/user/userSlice";
import { getChatHistory } from "@/components/FriendList/FriendList";
import "./Chat.css";

import { isEqual } from "loadsh";

export function scrollBarAnimation() {
  var curr = document.getElementById("messageArea");
  curr!.className = "scrolling-class grid";
  setTimeout(() => {
    curr!.className = "message-area-scrollbar grid";
  }, 1000);
}

const MessageArea = ({ focus }: any) => {
  const initialized_chat = useAppSelector(
    (state) => state.user.friendList[focus].initialized_chat
  );
  const chat_history = useAppSelector(
    (state) => state.user.friendList[focus].chat_history
  );

  useEffect(() => {
    if (focus == 0) {
      return;
    }
    const curr = document.getElementById("messageArea");
    if (curr!.scrollTop != 0) {
      setTimeout(() => {
        curr!.scrollTop = curr!.scrollHeight;
      }, 100);
      scrollBarAnimation();
    } else if (initialized_chat == false) {
      curr!.scrollTop = curr!.scrollHeight;
      scrollBarAnimation();
    } else {
      scrollBarAnimation();
    }
  }, [chat_history]);

  console.log("A");

  return (
    <>
      {Object.entries(chat_history).map(([key, index]) => {
        console.log(key);
        return <MessageBox message={index} key={key.toString()} />;
      })}
    </>
  );
};

export default function chat() {
  // state need to be organized :
  //  select:
  //    userid
  //  dispatch:
  //    channel_id

  const focus = useAppSelector((state) => state.user.focus);
  const data = useAppSelector((state) => state.user.data);
  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);
  const contextMenuAnchorPoint = useAppSelector(
    (state) => state.user.contextMenuAnchorPoint
  );
  const oldest_message_id = useAppSelector(
    (state) => state.user.friendList[focus].oldest_message_id
  );

  const dispatch = useAppDispatch();

  var scrollTimer = -1;

  useEffect(() => {
    if (
      document.getElementById("messageArea")!.clientHeight <
      document.getElementById("messageAreaWrapper")!.clientHeight
    ) {
      getChatHistory(focus, data?.id, dispatch, oldest_message_id);
    } else {
      dispatch(setUserFreindListInitialized(focus));
    }
  }, [oldest_message_id]);

  const handleClickOut = useCallback(() => {
    console.log("chat click", showContextMenu);
    showContextMenu ? dispatch(setUserShowContextMenu(false)) : null;
  }, [showContextMenu]);

  const OptionalCard = () => {
    if (showContextMenu) {
      console.log("ACP", contextMenuAnchorPoint);
      return (
        <ul
          style={{
            position: "absolute",
            top: contextMenuAnchorPoint.y,
            left: contextMenuAnchorPoint.x,
            backgroundColor: "#d0e3e2",
            minWidth: "200px",
            zIndex: 3,
          }}
          id="test"
        >
          <li>Reply</li>
          <li>Copy</li>
          <li>Forward</li>
          <li>Select</li>
          <li>Pin</li>
          <li>Delete</li>
        </ul>
      );
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Inter"],
      },
    });
  }, []);

  const handleOnScroll = () => {
    var curr = document.getElementById("messageArea");

    curr!.className = "scrolling-class grid";

    if (scrollTimer != -1) {
      clearTimeout(scrollTimer);
    }

    scrollTimer = window.setTimeout(() => {
      curr!.className = "message-area-scrollbar grid";
    }, 1000);

    if (curr?.scrollTop === 0) {
      getChatHistory(focus, data?.id, dispatch, oldest_message_id);
    }
  };

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
          <div
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="message-area-scrollbar grid"
            id="messageArea"
            onScroll={handleOnScroll}
          >
            <div
              style={{ justifySelf: "center", width: "70%" }}
              className="grid"
            >
              <MessageArea focus={focus} />
            </div>
          </div>
          <OptionalCard />
        </div>
        <div className="grid h-15vh">
          <InputArea />
        </div>
      </div>
    </div>
  );
}
