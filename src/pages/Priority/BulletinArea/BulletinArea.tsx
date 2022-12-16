import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import React from "react";
import { BASE } from "@/constants/endpoints";
import { setImportantMessages } from "@/states/user/userSlice";
import BulletinContextMenu from "./BulletinContextMenu/BulletinContextMenu";
import Message from "@/components/Message/Message";
import { access_token_header } from "@/constants/access_token";

export default function BulletinArea() {
  const important_messages = useAppSelector(
    (state) => state.user.importantMessages
  );

  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);

  const user_id = useAppSelector((state) => state.user.data?.id);
  const dispatch = useAppDispatch();

  var scrollTimer = -1;
  const handleOnScroll = () => {
    if (showContextMenu) {
      return;
    }
    var curr = document.getElementById("BulletinArea");

    curr!.className = "scrolling-class grid";

    if (scrollTimer != -1) {
      clearTimeout(scrollTimer);
    }

    scrollTimer = window.setTimeout(() => {
      curr!.className = "message-area-scrollbar grid";
    }, 1000);
  };

  React.useEffect(() => {
    async function fetch() {
      await axios
        .get(`${BASE}/channel/important_msg/${user_id}`, {
          headers: access_token_header(),
        })
        .then((res) => {
          dispatch(setImportantMessages(res));
        })
        .catch((e) => console.log(e));
    }
    fetch();
  }, []);

  return (
    <>
      <div
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          position: "relative",
          padding: "0 40px 0 40px",
        }}
        className="message-area-scrollbar grid"
        id="BulletinArea"
        onScroll={handleOnScroll}
      >
        <div style={{ justifySelf: "center", width: "100%" }} className="grid">
          {Object.entries(important_messages).map(([key, index]) => {
            return (
              <div className="grid" key={`${key.toString()}_div`}>
                <Message
                  message={index}
                  fromBulletin={true}
                  key={key.toString()}
                />
              </div>
            );
          })}
        </div>
      </div>
      {showContextMenu && <BulletinContextMenu />}
    </>
  );
}
