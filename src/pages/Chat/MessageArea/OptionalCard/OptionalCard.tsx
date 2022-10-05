import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import { BASE } from "@/constants/endpoints";
import {
  setImportantMessages,
  setSelectedMessageId,
} from "@/states/user/userSlice";

const handleImportantMessage = (
  dispatch: any,
  message_id: Array<number>,
  user_id: number,
  channel_id: number
) => {
  axios
    .post(`${BASE}/channel/important_msg/${user_id}`, {
      channel_id: channel_id,
      important_msg_id: message_id[0],
    })
    .then((res) => {
      const payload = {
        channel_id: channel_id,
        message_id: message_id,
      };
      dispatch(setImportantMessages(payload));
      dispatch(setSelectedMessageId({ reset: true }));
    })
    .catch((e) => console.log(e));
};

export default function OptionalCard() {
  const contextMenuAnchorPoint = useAppSelector(
    (state) => state.user.contextMenuAnchorPoint
  );

  const dispatch = useAppDispatch();
  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);
  const selectedMessageId = useAppSelector(
    (state) => state.user.selectedMessageId
  );
  const user_id = useAppSelector((state) => state.user.data!.id);
  const focus = useAppSelector((state) => state.user.focus);

  if (showContextMenu) {
    return (
      <ul
        style={{
          position: "absolute",
          top: contextMenuAnchorPoint.y,
          left: contextMenuAnchorPoint.x,
          backgroundColor: "#d0e3e2",
          minWidth: "200px",
          zIndex: 3,
        }}
        id="test"
      >
        <li>Reply</li>
        <li>Copy</li>
        <li>Forward</li>
        <li>Select</li>
        <li>Pin</li>
        <li>Delete</li>
        <li
          onClick={() =>
            handleImportantMessage(dispatch, selectedMessageId, user_id, focus)
          }
        >
          Set as important message
        </li>
      </ul>
    );
  } else {
    return <></>;
  }
}
