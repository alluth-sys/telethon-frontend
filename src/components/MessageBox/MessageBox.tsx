import { Message, setSelectedMessageId } from "@/states/user/userSlice";
import { Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useState, useCallback } from "react";
import "./MessageBox.css";
import moment from "moment";

import {
  setUserShowContextMenu,
  setUserContextMenuAnchorPoint,
} from "@/states/user/userSlice";

export function timeHandler(timestamp: string | undefined) {
  const time = moment(timestamp);
  const isToday = time.isSame(new Date(), "day");
  if (isToday) {
    return time.format("HH:mm");
  } else {
    return time.format("MMM DD");
  }
}

export function messageTimeHandler(timestamp: string | undefined) {
  const time = moment(timestamp);
  return time.format("HH:mm");
}

// TODO : fix escaping char
export function messageHandler(msg: string) {
  try {
    //console.log("origin message : ", msg);
    msg = msg.replace("\\\\", "\\");
    var result = msg.replace('\\"', '"');
    //console.log("result message : ", result);
    return result;
  } catch (e) {
    //console.log(e);
    return msg;
  }
}

const getItemStyle = (isMyself: boolean) => {
  return {
    justifySelf: isMyself ? "end" : "start",
  };
};

export default function MessageBox({ message }: any) {
  const data = useAppSelector((state) => state.user.data);

  const dispatch = useAppDispatch();

  const handleContextMenu = useCallback(
    (e: any) => {
      e.preventDefault();
      dispatch(setUserContextMenuAnchorPoint({ x: e.pageX, y: e.pageY }));
      dispatch(setUserShowContextMenu(true));
      dispatch(setSelectedMessageId({ message_id: Array(e.target.id) }));
    },
    [
      setUserShowContextMenu,
      setUserContextMenuAnchorPoint,
      setSelectedMessageId,
    ]
  );

  // handle dummy history
  if (message.channel_id == -1 && message.tag == "null") {
    return <></>;
  }
  if (message.tag == "message") {
    return (
      <div
        id={message.message_id}
        className="mb-5 mx-10"
        style={getItemStyle(message.sender_id == data!.id)}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
          className="bg-black w-fit max-w-sm h-fit rounded-xl flex"
          onContextMenu={handleContextMenu}
        >
          <Typography
            style={{ color: "white" }}
            className="font-loader pl-5 pr-5"
            id={message.message_id}
          >
            {messageHandler(message.data)}
          </Typography>
          <Typography
            className="pl-3 pr-5"
            style={{
              color: "white",
              alignSelf: "flex-end",
              fontSize: "10px",
            }}
          >
            {messageTimeHandler(message.timestamp)}
          </Typography>
        </div>
      </div>
    );
  } else if (message.tag == "image") {
    return (
      <div
        id={message.message_id}
        className="mb-5 mx-10 grid"
        style={getItemStyle(message.sender_id == data!.id)}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            position: "relative",
          }}
          className=" w-fit max-w-sm h-fit rounded-xl grid"
          onContextMenu={handleContextMenu}
        >
          <img
            src={`data:image/jpeg;base64,${message.data}`}
            style={{ borderRadius: 10 }}
            id={message.message_id}
          />
          <div className="overlay">{messageTimeHandler(message.timestamp)}</div>
        </div>
      </div>
    );
  } else if (message.tag == "gif") {
    return (
      <div
        id={message.message_id}
        className="mb-5 mx-10 grid"
        style={getItemStyle(message.sender_id == data!.id)}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            position: "relative",
          }}
          className=" w-fit max-w-sm h-fit rounded-xl grid"
          onContextMenu={handleContextMenu}
        >
          <img
            src={`data:image/gif;base64,${message.data}`}
            style={{ borderRadius: 10 }}
            id={message.message_id}
          />
          <div className="overlay">{messageTimeHandler(message.timestamp)}</div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
