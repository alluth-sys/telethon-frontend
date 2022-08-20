import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Button } from "@mui/material";
import { SocketContext } from "@/service/Socket";
import { useAppDispatch } from "@/app/hooks";
import { setUserFriendList } from "@/states/user/userSlice";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

export default function Home() {
  const socket = React.useContext(SocketContext);
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    socket.on("ping", (res) => {
      console.log(res);
    });
  }, [socket]);

  React.useEffect(()=>{
    socket.on("initial",(res) => {dispatch(setUserFriendList(res))})
  },[])

  return (
    <div className="w-full">
      <div>home</div>
      <Button
        onClick={() => {
          socket.emit("conn","5145920656");
        }}
      >
        test
      </Button>
    </div>
  );
}
