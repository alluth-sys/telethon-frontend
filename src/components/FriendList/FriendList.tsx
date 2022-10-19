import "./FriendList.css";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Typography } from "@mui/material";
import { setUserFocus } from "@/states/user/userSlice";
import axios from "axios";
import { setFriendChatHistory } from "@/states/user/userSlice";
import { scrollBarAnimation } from "@/pages/Chat/MessageArea/MessageArea";
import { Message } from "@/states/user/userSlice";
import { timeHandler } from "@/components/MessageBox/MessageBox";
import ProfilePicture from "@/components/MessageBox/ProfilePicture";
import {BASE} from "@/constants/endpoints"

export function wordsFilter(words: string, limit: number = 14) {
  if (words !== null) {
    if (words.length > limit) {
      return words.slice(0, limit) + "...";
    }
  }
  return words;
}

export default function FriendList() {
  const timeList = useAppSelector((state: RootState) => state.user.timeList);

  return (
    <div className="flex flex-col grow w-full">
      <div
        style={{ height: "100vh", overflow: "scroll", width: "320px" }}
        className="container-snap grow w-full"
      >
        {timeList.map((key, index) => {
          return <FriendBlock channel_id={key} key={key.toString()} />;
        })}
      </div>
    </div>
  );
}

export function getChatHistory(
  target_channel_id: number,
  user_id: number | undefined,
  dispatch: Function,
  message_id = 0
) {
  if (target_channel_id == 0) {
    return;
  }
  axios
    .get(`http://${BASE}/getMessage`, {
      params: {
        user_id: user_id,
        channel_id: target_channel_id,
        message_id: message_id,
      },
    })
    .then((res) => {
      dispatch(setFriendChatHistory(res));
      scrollBarAnimation();
    })
    .catch((e) => console.log(e));
}

type FriendBlockArg = { channel_id: number };
export function FriendBlock({ channel_id }: FriendBlockArg) {
  const user_id = useAppSelector((state) => state.user.data!.id);

  const chat_history = useAppSelector(
    (state) => state.user.friendList[channel_id]?.chat_history
  );
  const username = useAppSelector(
    (state) => state.user.friendList[channel_id]?.username
  );
  const profile_b64 = useAppSelector(
    (state) => state.user.friendList[channel_id]?.profile_b64
  );
  const last_message = useAppSelector(
    (state) => state.user.friendList[channel_id]?.last_message
  );
  const unread_count = useAppSelector(
    (state) => state.user.friendList[channel_id]?.unread_count
  );
  const dispatch = useAppDispatch();

  if (channel_id === undefined || channel_id === null) {
    return <></>;
  }
  return (
    <>
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate "
        style={{
          overflowWrap: "break-word",
          position: "relative",
          width: "320px",
        }}
        onClick={() => {
          dispatch(setUserFocus(channel_id));
          // if the history inexists, fetch the chat history
          if (Object.keys(chat_history).length == 0) {
            getChatHistory(channel_id, user_id, dispatch);
          }
        }}
      >
        <div style={{ padding: "0px 5px" }}>
          <ProfilePicture
            uid={username}
            imgSrc={`data:image/jpeg;base64,${profile_b64}`}
            width={64}
            height={64}
          />
        </div>
        <div className="font-loader grid ml-4 grow " style={{ height: "60px" }}>
          <div style={{ height: "20px", minHeight: "20px" }}>
            {wordsFilter(username, 8)}
          </div>

          <div
            className="flex "
            style={{
              overflowWrap: "break-word",
              whiteSpace: "nowrap",
              height: "20px",
              minHeight: "20px",
            }}
          >
            <MessageProfile {...last_message!} />
          </div>
        </div>
        <div
          className="w-fit"
          style={{
            position: "absolute",
            right: "3px",
            top: "11px",
            borderRadius: "20px",
          }}
        >
          <Typography
            className="px-2 font-loader"
            style={{
              color: "black",
              minWidth: "20px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {timeHandler(last_message?.timestamp)}
          </Typography>
        </div>
        {unread_count != 0 && (
          <div
            className="w-fit"
            style={{
              position: "absolute",
              right: "7px",
              top: "40px",
              backgroundColor: "green",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <Typography
              className="px-2"
              style={{ color: "white", minWidth: "43px" }}
            >
              {unread_count > 99 ? "99+" : unread_count}
            </Typography>
          </div>
        )}
      </div>
    </>
  );
}

export const MessageProfile = ({ tag, content }: Message) => {
  if (tag === "message") {
    return (
      <Typography className="font-loader">{wordsFilter(content)}</Typography>
    );
  } else if (tag === "image") {
    return (
      <Typography className="font-loader">
        {wordsFilter("Send a photo")}
      </Typography>
    );
  } else if (tag === "gif") {
    return (
      <Typography className="font-loader">
        {wordsFilter("Send a gif")}
      </Typography>
    );
  }
  return <Typography></Typography>;
};
