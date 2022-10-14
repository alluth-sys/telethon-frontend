import React from "react";
import { SocketContext } from "@/service/Socket";
import { useAppDispatch } from "@/app/hooks";
import { setUserFriendList } from "@/states/user/userSlice";

import BubblePanel from "./BubblePanel";

export default function Home() {
  return (
    <div className="w-full">
      <BubblePanel />
    </div>
  );
}
