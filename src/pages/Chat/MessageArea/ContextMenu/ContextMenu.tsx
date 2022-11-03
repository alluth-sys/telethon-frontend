import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import { BASE } from "@/constants/endpoints";
import {
  deleteFriendMessage,
  removeImportantMessages,
  setFriendPinnedMessage,
  setImportantMessages,
  setSelectedMessageId,
} from "@/states/user/userSlice";

const handleImportantMessage = async (
  dispatch: Function,
  message_id: number,
  user_id: number,
  channel_id: number
) => {
  await axios
    .post(`${BASE}/channel/important_msg/${user_id}`, {
      channel_id: channel_id,
      important_msg_id: message_id,
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

const removeImportantMessage = async (
  dispatch: Function,
  message_id: number,
  user_id: number,
  channel_id: number
) => {
  await axios
    .delete(`${BASE}/channel/important_msg/${user_id}`, {
      data: {
        channel_id: channel_id,
        important_msg_id: message_id,
      },
    })
    .then((res) => {
      dispatch(removeImportantMessages({ message_id: message_id }));
    })
    .catch((e) => console.log(e));
};

const pinMessage = async (
  dispatch: Function,
  message_id: number,
  user_id: number,
  channel_id: number,
  context: string | undefined
) => {
  await axios
    .post(`${BASE}/pin`, {
      message_id: message_id,
      user_id: user_id,
      channel_id: channel_id,
    })
    .then(() => {
      console.log(context);
      if (context != undefined) {
        const payload = {
          message_id: message_id,
          context: context,
        };
        dispatch(
          setFriendPinnedMessage({ friend_id: channel_id, payload: payload })
        );
      }
    })
    .catch((e) => console.log(e));
};

const deleteMessage = async (
  dispatch: Function,
  message_id: number,
  user_id: number,
  channel_id: number
) => {
  console.log("delete");
  await axios
    .delete(`${BASE}/deleteMessage`, {
      params: {
        message_id: message_id,
        user_id: user_id,
        channel_id: channel_id,
      },
    })
    .then((res) => {
      dispatch(
        deleteFriendMessage({ friend_id: channel_id, message_id: message_id })
      );
    })
    .catch((e) => console.log(e));
};

type ContextMenuProps = { setReplying: Function };
export default function ContextMenu({ setReplying }: ContextMenuProps) {
  const contextMenuAnchorPoint = useAppSelector(
    (state) => state.user.contextMenuAnchorPoint
  );

  const dispatch = useAppDispatch();
  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);
  const selectedMessageId = useAppSelector(
    (state) => state.user.selectedMessageId
  );
  const user_id = useAppSelector((state) => state.user.data!.id);
  let selectedMessageChannel: number;
  let selectedMessageIdInChannel: number;
  let selectedMessageContent: string | undefined;
  let isImportant: boolean | undefined;
  let mess: any;

  if (selectedMessageId.length > 0) {
    selectedMessageChannel = parseInt(selectedMessageId[0].split("_")[0]);
    selectedMessageIdInChannel = parseInt(selectedMessageId[0].split("_")[1]);

    selectedMessageContent = useAppSelector(
      (state) =>
        state.user.friendList[selectedMessageChannel].chat_history[
          selectedMessageIdInChannel
        ]?.content
    );
    isImportant = useAppSelector(
      (state) =>
        state.user.friendList[selectedMessageChannel].chat_history[
          selectedMessageIdInChannel
        ]?.isImportant
    );
    mess = useAppSelector(
      (state) =>
        state.user.friendList[selectedMessageChannel].chat_history[
          selectedMessageIdInChannel
        ]
    );
  }

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
        id="ContextMenu"
      >
        <li
          onClick={() => {
            setReplying(true);
          }}
        >
          Reply
        </li>
        <li
          onClick={() => {
            if (selectedMessageContent != undefined) {
              navigator.clipboard.writeText(selectedMessageContent);
            }
          }}
        >
          Copy
        </li>
        <li
          onClick={() =>
            pinMessage(
              dispatch,
              selectedMessageIdInChannel,
              user_id,
              selectedMessageChannel,
              selectedMessageContent
            )
          }
        >
          Pin
        </li>
        <li
          onClick={() =>
            deleteMessage(
              dispatch,
              selectedMessageIdInChannel,
              user_id,
              selectedMessageChannel
            )
          }
        >
          Delete
        </li>
        <li
          onClick={() => {
            if (!isImportant) {
              handleImportantMessage(
                dispatch,
                selectedMessageIdInChannel,
                user_id,
                selectedMessageChannel
              );
            } else {
              removeImportantMessage(
                dispatch,
                selectedMessageIdInChannel,
                user_id,
                selectedMessageChannel
              );
            }
          }}
        >
          {(isImportant && <a>Remove from important message</a>) || (
            <a>Set as important message</a>
          )}
        </li>
      </ul>
    );
  } else {
    return <></>;
  }
}
