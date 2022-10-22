import { useAppSelector } from "@/app/hooks";
import { wordsFilter } from "@/components/FriendList/FriendList";
import { IconButton, Typography } from "@material-ui/core";
import PushPinIcon from "@mui/icons-material/PushPin";

type PinnedProp = { focus: number };
export default function Pinned({ focus }: PinnedProp) {
  const pinned_message = useAppSelector(
    (state) => state.user.friendList[focus].pinned_message
  );
  return (
    <div style={{ display: "flex", alignItems: "center",overflow:"hidden",width:"30vw" }}>
      <IconButton
        style={{
          rotate: "-40deg",
          position: "relative",
          paddingBottom: "7px",
          cursor: "default",
        }}
      >
        <PushPinIcon />
      </IconButton>
      <Typography noWrap={true} style={{ paddingLeft: "1px" }}>
        {pinned_message.context}
      </Typography>
    </div>
  );
}
