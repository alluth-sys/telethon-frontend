import "./FriendList.css";
import ReactRoundedImage from "react-rounded-image";
import MyPhoto from "./car.jpg";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import React from "react";
import { Typography } from "@mui/material";

function wordsFilter(words) {
  if (words.length > 16) {
    return words.slice(0, 16) + "...";
  }
  return words;
}

export default function FriendList() {
  const { friendList, data } = useAppSelector((state: RootState) => state.user);

  var arr = ["A", "B", "C"];

  return (
    <div className="flex flex-col grow w-full">
      <div
        style={{ maxHeight: "100vh", overflow: "scroll" }}
        className="container-snap"
      >
        {Object.entries(friendList).map(([key, value]) => (
          <FriendBlock key={key} value={value} />
        ))}
      </div>
    </div>
  );
}

const FriendBlock = (key) => {
  var value = key["value"];
  return (
    <>
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate"
        style={{ overflowWrap: "break-word" }}
        onClick={() => console.log(`navigate to ${value["userid"]}`)}
      >
        <div style={{ padding: "0px 5px" }}>
          <Profile b64={value["profile_b64"]} />
        </div>
        <div className="grid ml-4 grow">
          <div>{value.username}</div>
         
            <div
              className="flex justify-between items-center grow"
              style={{ overflowWrap: "break-word", whiteSpace: "nowrap" }}
            >
              <Message
                tag={value["last_message_tag"]}
                message={value["last_message"]}
              />
              <div className="mr-8">{value["unread_count"]}</div>
            
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

function Profile(b64) {
  if (b64["b64"] !== "no profile") {
    return (
      <img
        src={`data:image/jpeg;base64,${b64["b64"]}`}
        className="w-15 h-15 rounded-full"
      />
    );
  }
  return;
}

const Message = ({ tag, message }) => {
  if (tag === "message") {
    return <Typography>{wordsFilter(message)}</Typography>;
  } else if (tag === "gif") {
    return <Typography>{wordsFilter("Send a gif")}</Typography>;
  }
  return;
};
