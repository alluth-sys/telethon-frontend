import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Button } from "@mui/material";
import { SocketContext } from "@/service/Socket";

export default function Home() {
  const socket = React.useContext(SocketContext);

  React.useEffect(() => {
    socket.on("ping", (res) => {
      console.log(res);
    });
  }, [socket]);

  return (
    <div className="w-full">
      <div>home</div>
      <Button
        onClick={() => {
          socket.emit("test");
        }}
      >
        test
      </Button>
    </div>
  );
}
