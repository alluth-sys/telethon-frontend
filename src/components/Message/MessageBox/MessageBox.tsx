import { Message, setSelectedMessageId } from "@/states/user/userSlice";
import { Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useState, useCallback, useRef, useEffect } from "react";
import "./MessageBox.css";
import moment from "moment";
import lottie from "lottie-web";

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
    msg = msg.replaceAll("\\\\", String.fromCharCode(92));
    msg = msg.replaceAll('\\"', '"');
    var result = msg; //.replace('\\"', '"');
    return result;
  } catch (e) {
    return msg;
  }
}

const getItemStyle = (isMyself: boolean) => {
  return {
    justifySelf: isMyself ? "end" : "start",
  };
};

type MessageBoxProps = { message: any; fromBulletin: boolean };
export default function MessageBox({ message, fromBulletin }: MessageBoxProps) {
  const data = useAppSelector((state) => state.user.data);
  const focus = useAppSelector((state) => state.user.focus);

  const dispatch = useAppDispatch();

  const handleContextMenu = useCallback(
    (e: any) => {
      e.preventDefault();
      // compute the proper X,Y
      const target_id = e.target.id;
      const node = document.getElementById(target_id);
      const rect = node?.getBoundingClientRect();
      if (rect != undefined) {
        let anchorX = rect.x + 10;
        let anchorY = rect.y + rect.height;
        if (anchorX + 100 > window.innerWidth) {
          anchorX -= 100;
        }
        if (anchorY + 200 > window.innerHeight) {
          anchorY -= 100;
        }
        dispatch(
          setUserContextMenuAnchorPoint({
            x: anchorX,
            y: anchorY,
          })
        );
        dispatch(setUserShowContextMenu(true));
      }
      if (!fromBulletin) {
        dispatch(
          setSelectedMessageId({ message_id: Array(`${focus}_${e.target.id}`) })
        );
      } else {
        dispatch(setSelectedMessageId({ message_id: Array(`${e.target.id}`) }));
      }
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
        id={message.message_id.toString()}
        className="mb-5 mx-2 flex"
        style={getItemStyle(message.sender_id == data!.id)}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
          className="bg-black w-fit max-w-sm h-fit rounded-xl flex"
          onContextMenu={handleContextMenu}
        >
          <Typography
            style={{ color: "white" }}
            className="font-loader pl-5 pr-5"
            id={message.message_id.toString()}
          >
            {messageHandler(message.content)}
          </Typography>
        </div>
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
    );
  } else if (message.tag == "image") {
    return (
      <div
        id={message.message_id.toString()}
        className="mb-5 mx-2 grid"
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
            src={`data:image/jpeg;base64,${message.content}`}
            style={{ borderRadius: 10 }}
            id={message.message_id.toString()}
          />
          <div className="overlay">{messageTimeHandler(message.timestamp)}</div>
        </div>
      </div>
    );
  } else if (message.tag == "gif") {
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
      const d = message.content;
      const container = document!.getElementById(
        `${message.message_id.toString()}canvas`
      );
      var animData = {
        container: container,
        animType: "html",
        loop: 1,
        prerender: true,
        autoplay: true,
        animationData: JSON.parse(d),
      };
      // @ts-ignore
      let animation = lottie.loadAnimation(animData);
      container?.addEventListener("click", () => {
        animation.playSegments([0, 90], false);
      });
    }, [ref]);

    return (
      <div
        id={message.message_id.toString()}
        className="mb-5 mx-2 grid"
        style={getItemStyle(message.sender_id == data!.id)}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            position: "relative",
          }}
          className=" w-fit max-w-sm h-fit rounded-xl grid"
          id="wrapper"
          onContextMenu={handleContextMenu}
        >
          <div
            id={message.message_id.toString() + "canvas"}
            style={{ width: "300px", height: "100px" }}
            ref={ref}
          ></div>
          <div className="overlay">{messageTimeHandler(message.timestamp)}</div>
        </div>
      </div>
    );
  } else if (message.tag == "audio") {
    return (
      <div
        id={message.message_id.toString()}
        className="mb-5 mx-2 grid"
        style={getItemStyle(message.sender_id == data!.id)}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            position: "relative",
          }}
          className=" w-fit max-w-sm h-fit rounded-xl flex"
          onContextMenu={handleContextMenu}
        >
          <audio controls>
            <source
              src={`data:audio/ogg;base64,${message.content}`}
              type="audio/ogg"
              style={{ borderRadius: 10 }}
              id={message.message_id.toString()}
            />
          </audio>
          <Typography
            className="pl-3 pr-5"
            style={{
              color: "black",
              alignSelf: "flex-end",
              fontSize: "10px",
            }}
          >
            {messageTimeHandler(message.timestamp)}
          </Typography>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
