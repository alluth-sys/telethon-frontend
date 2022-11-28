import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { wordsFilter } from "@/components/FriendList/FriendList";
import { IconButton, Typography } from "@material-ui/core";
import PushPinIcon from "@mui/icons-material/PushPin";
import {
  getChatPinnedHistory,
  scrollBarAnimation,
} from "@/pages/Chat/MessageArea/helpers";
import { setFriendChatHistory } from "@/states/user/userSlice";

type PinnedProp = { focus: number };
export default function Pinned({ focus }: PinnedProp) {
  const dispatch = useAppDispatch();

  const pinned_message = useAppSelector(
    (state) => state.user.friendList[focus].pinned_message
  );

  const oldest_message_id = useAppSelector(
    (state) => state.user.friendList[focus].oldest_message_id
  );

  const user_id = useAppSelector((state) => state.user.data!.id);

  function travelToPinned() {
    const messageArea = document.getElementById("messageArea");
    if (oldest_message_id > pinned_message.message_id) {
      messageArea!.scrollTop = 0;
      getChatPinnedHistory(focus, user_id, pinned_message.message_id).then(
        (res) => {
          console.log(res);
          dispatch(setFriendChatHistory(res));
          scrollBarAnimation();
        }
      );
    } else {
      const pinned_message_element = document.getElementById(
        "message" + String(pinned_message.message_id)
      );
      console.log(messageArea);
      console.log(pinned_message_element);
      messageArea!.scrollTop = pinned_message_element!.offsetTop + 1;
      scrollBarAnimation();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        width: "30vw",
      }}
    >
      <IconButton
        style={{
          rotate: "-40deg",
          position: "relative",
          paddingBottom: "7px",
          cursor: "default",
        }}
        onClick={travelToPinned}
      >
        <PushPinIcon />
      </IconButton>
      <Typography noWrap={true} style={{ paddingLeft: "1px" }}>
        {pinned_message.context}
      </Typography>
    </div>
  );
}
