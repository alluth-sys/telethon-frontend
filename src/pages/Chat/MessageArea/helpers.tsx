import { BASE } from "@/constants/endpoints";
import axios from "axios";

export const getChatHistory = (
  target_channel_id: number,
  user_id: number | undefined,
  message_id = 0
) => {
  return new Promise(function (resolve, reject) {
    if (target_channel_id == 0) {
      return;
    }
    axios
      .get(`${BASE}/getMessage`, {
        params: {
          user_id: user_id,
          channel_id: target_channel_id,
          message_id: message_id,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log(e), reject(e);
      });
  });
};

export const getChatPinnedMessage = (
  target_channel_id: number,
  user_id: number | undefined
) => {
  return new Promise(function (resolve, reject) {
    if (target_channel_id == 0) {
      return;
    }
    axios
      .get(`${BASE}/getPinnedMessage`, {
        params: {
          user_id: user_id,
          channel_id: target_channel_id,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log(e), reject(e);
      });
  });
};

export function scrollBarAnimation() {
  var curr = document.getElementById("messageArea");
  if (curr != undefined) {
    curr.className = "scrolling-class grid";
  }
  setTimeout(() => {
    if (curr != undefined) {
      curr!.className = "message-area-scrollbar grid";
    }
  }, 1000);
}
