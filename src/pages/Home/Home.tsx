import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Button } from "@mui/material";
import { SocketContext } from "@/service/Socket";

export default function Home() {
  const socket = React.useContext(SocketContext);
  return (
    <div className="w-full">
      <div>home</div>
      <Button
        onClick={() => {
          socket.emit("ping");
        }}
      >
        test
      </Button>
    </div>
  );
}
