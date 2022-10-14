import { useAppDispatch, useAppSelector } from "@/app/hooks";
import MessageBox from "@/components/MessageBox/MessageBox";
import OptionalCard from "@/pages/Chat/MessageArea/OptionalCard/OptionalCard";
import axios from "axios";
import React from "react";
import { BASE } from "@/constants/endpoints";
import { setImportantMessages } from "@/states/user/userSlice";

var scrollTimer = -1;
const handleOnScroll = () => {
  var curr = document.getElementById("BulletinArea");

  curr!.className = "scrolling-class grid";

  if (scrollTimer != -1) {
    clearTimeout(scrollTimer);
  }

  scrollTimer = window.setTimeout(() => {
    curr!.className = "message-area-scrollbar grid";
  }, 1000);
};

export default function BulletinArea() {
  const important_messages = useAppSelector(
    (state) => state.user.importantMessages
  );

  const user_id = useAppSelector((state) => state.user.data?.id);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    axios
      .get(`${BASE}/channel/important_msg/${user_id}`)
      .then((res) => {
        dispatch(setImportantMessages(res));
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <div
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          position: "relative",
        }}
        className="message-area-scrollbar grid"
        id="BulletinArea"
        onScroll={handleOnScroll}
      >
        <div style={{ justifySelf: "center", width: "100%" }} className="grid">
          {Object.entries(important_messages).map(([key, index]) => {
            return (
              <div className="grid" key={`${key.toString()}_div`}>
                <MessageBox message={index} key={key.toString()} />
              </div>
            );
          })}
        </div>
      </div>
      <OptionalCard />
    </>
  );
}
