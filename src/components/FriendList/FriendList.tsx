import "./FriendList.css";
import ReactRoundedImage from "react-rounded-image";
import MyPhoto from "./car.jpg";
import {useAppSelector} from "@/app/hooks"
import { RootState } from "@/app/store";
import React from "react"

function wordsFilter(words) {
  if (words.length > 16) {
    return words.slice(0, 16) + "...";
  }
  return words;
}

export default function FriendList() {
  const {friendList,data} = useAppSelector((state:RootState)=>state.user)

  React.useEffect(()=>{
    console.log("AAA",friendList)
  },[])

  return (
    <div className="flex flex-col grow w-full">
     
        <div style={{ maxHeight: "100vh",overflow:"scroll"}} className="container-snap">
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
        </div>
     
    </div>
  );
}

function FriendBlock() {
  return (
    <>
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate"
        style={{ overflowWrap: "break-word" }}
        onClick={() => console.log("navigate to ")}
      >
        <div style={{padding:"0px 5px"}}>
        <Profile />
        </div>
        <div
          className="flex ml-4 "
          style={{ overflowWrap: "break-word", whiteSpace: "nowrap" }}
        >
          {wordsFilter("sample text111111111")}
        </div>
      </div>
      <hr />
    </>
  );
}

function Profile() {
  return (
    <ReactRoundedImage
      image={MyPhoto}
      roundedColor="#321124"
      imageWidth="50"
      imageHeight="50"
      roundedSize="0"
      borderRadius="50"
      style={{minWidth:"50px"}}
    />
  );
}
