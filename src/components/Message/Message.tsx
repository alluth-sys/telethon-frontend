import { useAppSelector } from "@/app/hooks";
import { BASE } from "@/constants/endpoints";
import axios from "axios";
import { useEffect, useState } from "react";
import MessageBox from "./MessageBox/MessageBox";
import ProfilePicture from "./ProfilePicture/ProfilePicture";
import { access_token_header } from "@/constants/access_token";

type MessageBoxProps = { message: any; fromBulletin: boolean };

const fetchSrc = async (message: any, user_id: number | undefined) => {
  if (localStorage.getItem(message.sender_id) != null) {
    return localStorage.getItem(message.sender_id);
  } else {
    await axios
      .get(`${BASE}/channel/photo/${user_id}`, {
        params: {
          user_list: message.sender_id,
        },
        headers: access_token_header(),
      })
      .then((res) => {
        localStorage.setItem(message.sender_id, res.data.context[0].b64);
        return res.data.context[0].b64;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return "";
};

export default function Message({ message, fromBulletin }: MessageBoxProps) {
  if (message.channel_id == -1 && message.tag == "null") {
    return <></>;
  }
  const user_id = useAppSelector((state) => state.user.data?.id);
  const [imgSrc, setImgSrc] = useState<string | null>("");
  useEffect(() => {
    fetchSrc(message, user_id).then((res) => {
      setImgSrc(res);
    });
  }, [localStorage.getItem(message.sender_id)]);

  return (
    <>
      {(message.sender_id == user_id && (
        <MessageBox message={message} fromBulletin={fromBulletin} />
      )) || (
        <div className="flex">
          <ProfilePicture
            uid={message.sender_name}
            imgSrc={`data:image/jpeg;base64,${imgSrc}`}
            width={30}
            height={30}
            simple={true}
          />
          <MessageBox message={message} fromBulletin={fromBulletin} />
        </div>
      )}
    </>
  );
}
