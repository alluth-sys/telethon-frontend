import FriendList from "@/components/FriendList/FriendList";
import InputArea from "@/pages/Chat/InputArea/InputArea";
import MessageBox from "@/components/MessageBox/MessageBox";

import WebFont from "webfontloader";

import { useEffect } from "react";

export default function chat() {
  // state need to be organized :
  //  select:
  //    userid
  //  dispatch:
  //    channel_id

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Inter"],
      },
    });
  });

  return (
    <div className="flex grow justify-start">
      <div className="flex w-2/12">
        <FriendList />
      </div>
      <div className="grow grid content-end w-10/12">
        <MessageBox message="100" />
        <MessageBox message="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" />
        <div className="grid h-24">
          <InputArea />
        </div>
      </div>
    </div>
  );
}
