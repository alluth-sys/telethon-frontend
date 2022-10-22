import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { BASE } from "@/constants/endpoints";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { updateFriendUnreadCount } from "@/states/user/userSlice";

export default function AckButton() {
  const user_id = useAppSelector((state) => state.user.data!.id);
  const focus = useAppSelector((state) => state.user.focus);

  const dispatch = useAppDispatch();

  const sendAck = async (user_id: number, target_channel_id: number) => {
    await axios
      .post(`${BASE}/ack`, {
        user_id: user_id,
        channel_id: target_channel_id,
      })
      .then((res) => dispatch(updateFriendUnreadCount(res)))
      .catch((e) => console.log(e));
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 105,
        right: 100,
        backgroundColor: "black",
        borderRadius: "50px",
      }}
      onClick={() => sendAck(user_id, focus)}
    >
      <CheckIcon
        style={{ cursor: "pointer", color: "white", margin: "10 10 10 10 " }}
      />
    </div>
  );
}
