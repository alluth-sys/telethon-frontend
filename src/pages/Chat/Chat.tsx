import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageBox from "@/components/MessageBox/MessageBox";

import WebFont from "webfontloader";
import { useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import React from "react";

export default function chat() {
  // state need to be organized :
  //  select:
  //    userid
  //  dispatch:
  //    channel_id

  const { friendList, focus } = useAppSelector((state) => state.user);
  const [chatFlag, setChatFlag] = React.useState(false);
  const [chatHistory, setChatHistory] = React.useState({});
  React.useEffect(() => {
    setChatHistory({});
    try{
      console.log("try")
      setChatHistory(friendList[focus].chat_history);
      Object(chatHistory)
      setChatFlag(true)
    }catch{
      console.log("ERR")
      setChatFlag(false)
    }
  }, [friendList[focus]]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Inter"],
      },
    });
  }, []);

  return (
    <div className="flex grow justify-start">
      <div className="flex" style={{ width: "320px" }}>
        <FriendList />
      </div>
      <div className="grow grid content-end ">
        <div className="flex flex-col grow w-full">
          <div
          style={{ maxHeight: "90vh", overflow: "scroll" }}
          className="container-snap"
          >
        {Object.entries(chatHistory).map(([key, index])=> {
          return <MessageBox message={index}/>
        })}
          </div>
       </div>
        
        <div className="grid" >
          <InputArea />
        </div>
      </div>
    </div>
  );
}
