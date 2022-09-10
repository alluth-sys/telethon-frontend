import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageBox from "@/components/MessageBox/MessageBox";

import WebFont from "webfontloader";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import React from "react";

import {setUserSet} from "@/states/user/userSlice"


import axios from "axios";

export default function chat() {
  // state need to be organized :
  //  select:
  //    userid
  //  dispatch:
  //    channel_id

  const { friendList, focus, data , set } = useAppSelector((state) => state.user);
  const [chatHistory, setChatHistory] = React.useState({});
  const [chatFlag,setChatFlag] = React.useState(false)
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    try{
      console.log("curr", chatHistory);
      
      setChatHistory({});
      setChatHistory(friendList[focus].chat_history);
      Object.entries(friendList[focus].chat_history)
      setChatFlag(true)
    }catch{
      console.log("err")
    }
    
  }, [friendList[focus]]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Inter"],
      },
    });
  }, []);

  useEffect(() => {
    
  }, [chatHistory]);

  const handleOnScroll = () => {
    var curr = document.getElementById("messageArea")
    if(curr?.scrollTop === 0){
      console.log(friendList[focus].oldest_message_id)
    }
  };
  

  class MessageArea extends React.Component {
    curr = document.getElementById("messageArea")

    componentDidMount(): void {
        this.curr?.scrollTo(0,this.curr?.scrollHeight)
    }

    messagesEndRef = React.createRef()

    render(){
    return (
      <div className="flex flex-col grow w-full">
        <div
          style={{ maxHeight: "85vh", overflow: "scroll" }}
          className="container-snap content-end"
          id="messageArea"
          onScroll={handleOnScroll}
        >
          {chatFlag&&Object.entries(chatHistory).map(([key, index]) => {
            return <MessageBox message={index} key={key}/>;
          })}
         <div ref={this.messagesEndRef} />
        </div>
      </div>
    );}
  };

  return (
    <div className="flex grow justify-start">
      <div className="flex" style={{ width: "320px" }}>
        <FriendList />
      </div>
      <div className="grow grid content-end ">
          <MessageArea />
        <div className="grid h-15vh">
          <InputArea />
        </div>
      </div>
    </div>
  );
}
