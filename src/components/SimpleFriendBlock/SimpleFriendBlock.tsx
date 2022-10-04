import { useAppSelector } from "@/app/hooks";
import { Friend } from "@/states/user/userSlice";
import { MessageProfile, wordsFilter } from "../FriendList/FriendList";
import ProfilePicture from "../MessageBox/ProfilePicture";
import { Typography } from "@mui/material";
import { timeHandler } from "../MessageBox/MessageBox";

export default function SimpleFriendBlock(Friend: any) {
  var value: Friend | undefined = Friend["Friend"];

  if (value?.channel_id === undefined || value.channel_id === null) {
    return <></>;
  }
  return (
    <>
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate"
        style={{ overflowWrap: "break-word", position: "relative" }}
      >
        <div style={{ padding: "0px 5px" }}>
          <ProfilePicture
            uid={value!.username}
            imgSrc={`data:image/jpeg;base64,${value!.profile_b64}`}
            width={64}
            height={64}
          />
        </div>
        <div className="grid ml-4 grow " style={{ height: "60px" }}>
          <div style={{ height: "20px", minHeight: "20px" }}>
            {wordsFilter(value.username, 8)}
          </div>

          <div
            className="flex "
            style={{
              overflowWrap: "break-word",
              whiteSpace: "nowrap",
              height: "20px",
              minHeight: "20px",
            }}
          >
            <MessageProfile {...value!.last_message!} />
          </div>
        </div>
        <div
          className="w-fit"
          style={{
            position: "absolute",
            right: "3px",
            top: "11px",
            borderRadius: "20px",
          }}
        >
          <Typography
            className="px-2"
            style={{
              color: "black",
              minWidth: "20px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {timeHandler(value!.last_message?.timestamp)}
          </Typography>
        </div>
        {value!.unread_count != 0 && (
          <div
            className="w-fit"
            style={{
              position: "absolute",
              right: "7px",
              top: "40px",
              backgroundColor: "green",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <Typography
              className="px-2"
              style={{ color: "white", minWidth: "43px" }}
            >
              {value!.unread_count > 99 ? "99+" : value!.unread_count}
            </Typography>
          </div>
        )}
      </div>
      <hr />
    </>
  );
}
