import { Message } from "@/states/user/userSlice";
import { Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useState, useCallback, useEffect } from "react";
import "./MessageBox.css";

import {
  setUserShowContextMenu,
  setUserContextMenuAnchorPoint,
} from "@/states/user/userSlice";

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

  if (message.channel == -1 && message.tag == "null") {
    return <></>;
  }
  if (message.tag == "message") {
    if (message.sender_id == data!.id) {
      return (
        <div className="mb-5 mx-10" style={{ justifySelf: "end" }}>
          <div
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
            }}
            className="bg-black w-fit max-w-sm h-fit rounded-xl"
            onContextMenu={handleContextMenu}
          >
            <Typography
              style={{ color: "white" }}
              className="font-loader pl-5 pr-5"
              id={message.message_id.toString()}
            >
              {message.data}
            </Typography>
          </div>
        </div>
      );
    } else
      return (
        <div className="mb-5 mx-10 ">
          <div
            style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
            className="bg-black w-fit max-w-sm h-fit rounded-xl"
            onContextMenu={handleContextMenu}
          >
            <Typography
              style={{ color: "white" }}
              className="font-loader pl-5 pr-5"
              id={message.message_id.toString()}
            >
              {message.data}
            </Typography>
          </div>
        </div>
      );
  } else {
    return (
      <div className="mb-5 mx-10 justify-end">
        <div
          style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
          className="bg-black w-fit max-w-sm h-fit rounded-xl"
        >
          <Typography
            style={{ color: "white" }}
            className="font-loader pl-5 pr-5"
            id={message.message_id.toString()}
          >
            {message.tag}
          </Typography>
        </div>
      </div>
    );
  }
}
