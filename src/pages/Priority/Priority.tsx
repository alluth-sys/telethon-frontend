import FriendList from "@/components/FriendList/FriendList";
import { Typography } from "@mui/material";

export default function priority() {
  return (
    <div className="flex grow justify-start">
      <div className="flex" style={{ width: "320px" }}>
        <FriendList limit={9} />
      </div>
      <div className="bg-black h-full w-1"></div>
      <div className="flex" style={{ width: "320px" }}>
        <FriendList limit={9} />
      </div>
      <div className="grid  grow">
        <div className="bg-black flex h-1/3 grow justify-center items-center">
          <Typography
            style={{ color: "white", fontSize: 50 }}
            className="text-4xl"
          >
            Bulletin Board
          </Typography>
        </div>
      </div>
    </div>
  );
}
