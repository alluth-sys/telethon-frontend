import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageBox from "@/components/MessageBox/MessageBox";

import WebFont from "webfontloader";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import React from "react";
import ReactDOM from "react-dom";

import { setFriendChatHistory } from "@/states/user/userSlice";
import { getChatHistory } from "@/components/FriendList/FriendList";
import "./Chat.css";

import axios from "axios";


export function scrollBarAnimation(){
  var curr = document.getElementById("messageArea");
  curr.className = "scrolling-class";
  setTimeout(() => {
    curr.className = "message-area-scrollbar";
  }, 1000);
}

export default function chat() {
  // state need to be organized :
  //  select:
  //    userid
  //  dispatch:
  //    channel_id

  const { friendList, focus, data } = useAppSelector(
    (state) => state.user
  );
  const { oldest_message_id} = useAppSelector(
    state => state.user.friendList[focus]
  )
  const dispatch = useAppDispatch();

  var scrollTimer = -1;

  useEffect(()=>{
    if (
      document.getElementById("messageArea")?.clientHeight <
        document.getElementById("messageAreaWrapper")?.clientHeight && oldest_message_id!=0
    ) {
      getChatHistory(focus,data?.id,dispatch,oldest_message_id)
    }
  },[oldest_message_id])

  useEffect(()=>{
    if(focus==0){
      return 
    }
    const curr = document.getElementById("messageArea")
    if(curr?.scrollTop!=0){
      curr.scrollTop = curr?.scrollHeight
      scrollBarAnimation()
    }else{
      console.log("scrollTop = " , curr.scrollTop)
      scrollBarAnimation()
    }
  },[friendList[focus].chat_history])


  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Inter"],
      },
    });
  }, []);

  

  const handleOnScroll = () => {
    var curr = document.getElementById("messageArea");

    curr.className = "scrolling-class";

    if (scrollTimer != -1) {
      clearTimeout(scrollTimer);
    }

    scrollTimer = window.setTimeout(() => {
      curr.className = "message-area-scrollbar";
    }, 1000);

    if (curr?.scrollTop === 0) {
      console.log(oldest_message_id);
      getChatHistory(focus,data?.id,dispatch,oldest_message_id)
    }
  };

  // it will trigger rerender upexpectly if I use this?
  function MessageArea() {
    const messages = Object.entries(friendList[focus].chat_history).map(
      ([key, index]) => {
        return <MessageBox message={index} key={key.toString()} />;
      }
    );

    return (
      <div
        className="flex flex-col grow w-full "
        style={{ height: "85vh", justifyContent: "end" }}
      >
        <div
          style={{
            height: "85vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
          className="message-area-scrollbar content-end"
          id="messageArea"
          onScroll={handleOnScroll}
        >
          {messages}
        </div>
      </div>
    );
  }

  return (
    <div className="flex grow justify-start">
      <div className="flex" style={{ width: "320px" }}>
        <FriendList />
      </div>
      <div className="grow grid content-end ">
        <div
          className="flex flex-col grow w-full "
          style={{ height: "85vh", justifyContent: "end" }}
          id="messageAreaWrapper"
        >
          <div
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="message-area-scrollbar content-end"
            id="messageArea"
            onScroll={handleOnScroll}
          >
            {Object.entries(friendList[focus].chat_history).map(
              ([key, index]) => {
                return <MessageBox message={index} key={key.toString()} />;
              }
            )}
          </div>
        </div>
        <div className="grid h-15vh">
          <InputArea />
        </div>
      </div>
    </div>
  );
}
