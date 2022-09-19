import { Message } from "@/states/user/userSlice";
import { Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useState, useCallback, useEffect } from "react";
import "./MessageBox.css";
import moment from "moment";

import {
  setUserShowContextMenu,
  setUserContextMenuAnchorPoint,
} from "@/states/user/userSlice";




export function timeHandler(timestamp: string | undefined) {
  const time = moment(timestamp)
  const isToday = time.isSame(new Date(),"day");
  if(isToday){
  return time.format("HH:mm");
  }else {
    return time.format("MMM d")
  }
}

export function messageHandler(msg: string) {
  try {
    var result = msg.replace('\\"', '"');
    return result;
  } catch (e) {
    console.log(e);
    return msg;
  }
}

export default function MessageBox({ message }: any) {
  const { data } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const handleContextMenu = useCallback(
    (e: any) => {
      e.preventDefault();
      dispatch(setUserContextMenuAnchorPoint({ x: e.pageX, y: e.pageY }));
      dispatch(setUserShowContextMenu(true));
    },
    [setUserShowContextMenu, setUserContextMenuAnchorPoint]
  );

  // handle dummy history
  if (message.channel == -1 && message.tag == "null") {
    return <></>;
  }

  if (message.sender_id == data!.id) {
    if (message.tag == "message") {
      return (
        <div className="mb-5 mx-10" style={{ justifySelf: "end" }}>
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
              id={message.message_id.toString()}
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
              {timeHandler(message.timestamp)}
            </Typography>
          </div>
        </div>
      );
    } else if (message.tag == "image") {
      return (
        <div className="mb-5 mx-10 grid" style={{ justifySelf: "end" }}>
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
            />
            <div className="overlay">{timeHandler(message.timestamp)}</div>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  } else {
    if (message.tag == "message") {
      return (
        <div className="mb-5 mx-10" style={{ justifySelf: "start" }}>
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
              className="font-loader pl-5"
              id={message.message_id.toString()}
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
              {timeHandler(message.timestamp)}
            </Typography>
          </div>
        </div>
      );
    } else if (message.tag == "image") {
      return (
        <div className="mb-5 mx-10 grid" style={{ justifySelf: "start" }}>
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
            />
            <div className="overlay">{timeHandler(message.timestamp)}</div>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
}
