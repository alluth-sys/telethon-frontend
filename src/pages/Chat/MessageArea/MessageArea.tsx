import { useAppSelector, useAppDispatch } from "@/app/hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import MessageBox from "@/components/MessageBox/MessageBox";
import ContextMenu from "./ContextMenu/ContextMenu";
import {
  setFriendChatHistory,
  setFriendPinnedMessage,
  setUserFreindListInitialized,
} from "@/states/user/userSlice";
import Timeindicator from "./TimeIndicator/Timeindicator";
import ScrollButton from "../ScrollButton/ScrollButton";
import AckButton from "../AckButton/AckButton";
import Loader from "./Loader/Loader";
import {
  getChatHistory,
  getChatPinnedMessage,
  scrollBarAnimation,
} from "./helpers";
import ReplyArea from "./ReplyArea/Reply";

export default function MessageArea({ focus }: any) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState(false);
  const user_id = useAppSelector((state) => state.user.data!.id);
  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);

  const oldest_message_id = useAppSelector(
    (state) => state.user.friendList[focus].oldest_message_id
  );

  const initialized_chat = useAppSelector(
    (state) => state.user.friendList[focus].initialized_chat
  );
  const chat_history = useAppSelector(
    (state) => state.user.friendList[focus].chat_history
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getChatPinnedMessage(focus, user_id).then((res: Response | any) => {
      if (res.data.context.message_id != -1) {
        const payload = { friend_id: focus, payload: res.data.context };
        dispatch(setFriendPinnedMessage(payload));
      }
    });
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

  var scrollTimer = -1;
  const handleOnScroll = () => {
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
      for (let i = 0; i < 20; i++) {
        getChatHistory(focus, user_id, oldest_message_id - i).then((res) => {
          dispatch(setFriendChatHistory(res));
          scrollBarAnimation();
          setLoading(false);
        });
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
              <div className="grid" key={`${key.toString()}_div`}>
                {!sameDay && previous_message_timestamp != "Invalid date" && (
                  <Timeindicator
                    timestamp={current_message_timestamp}
                    key={`${key.toString()}_${current_message_timestamp}`}
                  />
                )}
                <MessageBox
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
