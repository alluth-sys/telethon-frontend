import "./FriendList.css";
import MyPhoto from "./car.jpg";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import React from "react";
import { Typography } from "@mui/material";
import { setUserFocus } from "@/states/user/userSlice";
import axios from "axios";
import { setFriendChatHistory } from "@/states/user/userSlice";
import {scrollBarAnimation} from "@/pages/Chat/Chat"
import { Friend , Message} from "@/states/user/userSlice"
import { Dictionary } from "@reduxjs/toolkit";

function wordsFilter(words: string, limit: number = 14) {
  if (words !== null) {
    if (words.length > limit) {
      return words.slice(0, limit) + "...";
    }
  }
  return words;
}

export default function FriendList({ limit = 0 }) {
  const {  timeList } = useAppSelector(
    (state: RootState) => state.user
  );
  var i = 0;
  return (
    <div className="flex flex-col grow w-full">
      <div
        style={{ maxHeight: "100vh", overflow: "scroll" }}
        className="container-snap"
      >
        {timeList.map((Friend, index) => {
          return <FriendBlock Friend={Friend} key={index.toString()} />;
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
  if(target_channel_id==-1){
    return 
  }
  axios
    .get("http://localhost:5000/getMessage", {
      params: {
        user_id: user_id,
        channel_id: target_channel_id,
        message_id: message_id,
      },
    })
    .then((res) => {
      dispatch(setFriendChatHistory(res));
      scrollBarAnimation()
    })
    .catch((e) => console.log(e));
}

const FriendBlock = (Friend:any) => {
  const { friendList,data } = useAppSelector(
    (state) => state.user
  );


  const dispatch = useAppDispatch();
  var value:Friend|undefined = Friend["Friend"];

  if (value?.channel_id === undefined || value.channel_id === null) {
    return <></>;
  }
  return (
    <>
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate"
        style={{ overflowWrap: "break-word" }}
        onClick={() => {
          dispatch(setUserFocus(value!["channel_id"]))
          if (Object.keys(friendList[value!["channel_id"]].chat_history).length == 0){
            getChatHistory(value!["channel_id"], data?.id, dispatch);
          }
        }}
      >
        <div style={{ padding: "0px 5px" }}>
          <Profile b64={value["profile_b64"]} />
        </div>
        <div className="grid ml-4 grow">
          <div>{wordsFilter(value.username, 8)}</div>

          <div
            className="flex justify-between items-center grow"
            style={{ overflowWrap: "break-word", whiteSpace: "nowrap" }}
          >
            <MessageProfile
              {...value!.last_message!}
            />
            <div className="mr-8">{value["unread_count"]}</div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

function Profile(b64:Dictionary<string>) {
  if (b64["b64"] !== "no profile") {
    return (
      <img
        src={`data:image/jpeg;base64,${b64["b64"]}`}
        className="w-15 h-15 rounded-full"
      />
    );
  }
  return <></>;
}

const MessageProfile = ({ tag, data }:Message) => {
  if (tag === "message") {
    return <Typography>{wordsFilter(data)}</Typography>;
  } else if (tag === "gif") {
    return <Typography>{wordsFilter("Send a gif")}</Typography>;
  }
  return <></>;
};
