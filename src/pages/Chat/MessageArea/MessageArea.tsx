import { useAppSelector, useAppDispatch } from "@/app/hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import MessageBox from "@/components/Message/MessageBox/MessageBox";
import ContextMenu from "./ContextMenu/ContextMenu";
import {
  setFriendChatHistory,
  setFriendPinnedMessage,
  setSearchingMessage,
  setUserFreindListInitialized,
  setUserShowContextMenu,
} from "@/states/user/userSlice";
import Timeindicator from "./TimeIndicator/Timeindicator";
import ScrollButton from "../ScrollButton/ScrollButton";
import AckButton from "../AckButton/AckButton";
import Loader from "./Loader/Loader";
import {
  computeDistance,
  getChatHistory,
  getChatPinnedHistory,
  getChatPinnedMessage,
  scrollBarAnimation,
} from "./helpers";
import ReplyArea from "./ReplyArea/Reply";
import Message from "@/components/Message/Message";

export default function MessageArea({ focus }: any) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState(false);
  const user_id = useAppSelector((state) => state.user.data!.id);
  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);
  const contextMenuAnchorPoint = useAppSelector(
    (state) => state.user.contextMenuAnchorPoint
  );
  const oldest_message_id = useAppSelector(
    (state) => state.user.friendList[focus].oldest_message_id
  );
  const initialized_chat = useAppSelector(
    (state) => state.user.friendList[focus].initialized_chat
  );
  const chat_history = useAppSelector(
    (state) => state.user.friendList[focus].chat_history
  );
  const searchingMessage = useAppSelector(
    (state) => state.user.searchingMessage
  );

  const [scrolled, setScrolled] = useState(false);

  const handleOnMove = (e: any) => {
    const cursorPos = { x: e.clientX, y: e.clientY };
    if (computeDistance(cursorPos, contextMenuAnchorPoint) > 300) {
      dispatch(setUserShowContextMenu(false));
    }
  };

  useEffect(() => {
    if (searchingMessage == "-1") {
      return;
    }
    const channel: number = parseInt(searchingMessage.split("_")[0]);
    const message_id: number = parseInt(searchingMessage.split("_")[1]);
    const messageArea = document.getElementById("messageArea");
    if (oldest_message_id > message_id || oldest_message_id == -1) {
      messageArea!.scrollTop = 0;
      getChatPinnedHistory(focus, user_id, message_id, dispatch).then(() => {
        const element = document.getElementById(message_id.toString());
        element?.scrollIntoView();
      });
    } else {
      const pinned_message_element = document.getElementById(
        String(message_id)
      );
      setTimeout(
        () => (messageArea!.scrollTop = pinned_message_element!.offsetTop + 1),
        500
      );
      scrollBarAnimation();
      dispatch(setSearchingMessage(-1));
    }
  }, [searchingMessage]);

  useEffect(() => {
    if (!showContextMenu) {
      document.onmousemove = null;
    } else {
      if (contextMenuAnchorPoint != undefined) {
        document.onmousemove = handleOnMove;
      }
    }
  }, [showContextMenu]);

  useEffect(() => {
    getChatPinnedMessage(focus, user_id).then((res: Response | any) => {
      if (res.data.context.message_id != -1) {
        const payload = { friend_id: focus, payload: res.data.context };
        dispatch(setFriendPinnedMessage(payload));
      }
    });
    if (!initialized_chat) {
      getChatHistory(focus, user_id, oldest_message_id).then((res) => {
        dispatch(setFriendChatHistory(res));
        scrollBarAnimation();
        setLoading(false);
      });
    }
    setReplying(false);
  }, [focus]);

  useEffect(() => {
    if (
      document.getElementById("messageArea")!.scrollHeight <
      document.getElementById("messageAreaWrapper")!.clientHeight
    ) {
      getChatHistory(focus, user_id, oldest_message_id).then((res) => {
        dispatch(setFriendChatHistory(res));
        scrollBarAnimation();
        setLoading(false);
      });
    } else {
      dispatch(setUserFreindListInitialized(focus));
    }
  }, [oldest_message_id]);

  useEffect(() => {
    if (focus == 0) {
      return;
    }
    const curr = document.getElementById("messageArea");
    if (curr!.scrollTop + curr!.clientHeight + 200 > curr!.scrollHeight) {
      setTimeout(() => {
        curr!.scrollTop = curr!.scrollHeight;
      }, 100);
      scrollBarAnimation();
    } else if (!initialized_chat) {
      curr!.scrollTop = curr!.scrollHeight;
      scrollBarAnimation();
    } else {
      scrollBarAnimation();
    }
  }, [chat_history]);

  var scrollTimer = -1;
  const handleOnScroll = () => {
    if (showContextMenu) {
      return;
    } else {
      var curr = document.getElementById("messageArea");
      if (curr!.scrollHeight - curr!.scrollTop <= curr!.clientHeight + 2) {
        setScrolled(false);
      } else {
        setScrolled(true);
      }

      curr!.className = "scrolling-class grid";

      if (scrollTimer != -1) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        curr!.className = "message-area-scrollbar grid";
      }, 1000);

      if (curr?.scrollTop === 0) {
        setLoading(true);
        const fun = async () => {
          for (let i = 0; i < 10; i++) {
            await getChatHistory(focus, user_id, oldest_message_id - i).then(
              (res) => {
                dispatch(setFriendChatHistory(res));
                scrollBarAnimation();
              }
            );
          }
        };
        fun().then(() => setLoading(false));
      }
    }
  };

  var current_message_timestamp: string = "";
  var previous_message_timestamp: string = "";
  var sameDay = true;

  return (
    <>
      <div
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          position: "relative",
          width: "100%",
        }}
        className="message-area-scrollbar grid"
        id="messageArea"
        onScroll={handleOnScroll}
      >
        <Loader loading={loading} />
        <div style={{ justifySelf: "center", width: "72%" }} className="grid">
          {Object.entries(chat_history).map(([key, index]) => {
            current_message_timestamp = moment(
              chat_history[key]?.timestamp
            ).format("YYYY-MM-DD");
            if (current_message_timestamp == previous_message_timestamp) {
              sameDay = true;
            } else {
              sameDay = false;
            }
            previous_message_timestamp = current_message_timestamp;
            return (
              <div
                className="grid"
                key={`${key.toString()}_div`}
                id={"message" + String(index?.message_id)}
              >
                {!sameDay && previous_message_timestamp != "Invalid date" && (
                  <Timeindicator
                    timestamp={current_message_timestamp}
                    key={`${key.toString()}_${current_message_timestamp}`}
                  />
                )}
                <Message
                  message={index}
                  fromBulletin={false}
                  key={key.toString()}
                />
              </div>
            );
          })}
        </div>
      </div>
      {replying && <ReplyArea setReplying={setReplying} />}
      {showContextMenu && <ContextMenu setReplying={setReplying} />}
      <ScrollButton display={scrolled} />
      {focus != 0 && <AckButton />}
    </>
  );
}
