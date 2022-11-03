import { useAppSelector } from "@/app/hooks";
import ProfilePicture from "@/components/Message/ProfilePicture/ProfilePicture";
import { IconButton, Typography } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

type DescriptionProp = {
  collapsed: boolean;
  setCollapse: Function;
  focus: number;
};
export default function Description({
  collapsed,
  setCollapse,
  focus,
}: DescriptionProp) {
  const friend_name = useAppSelector(
    (state) => state.user.friendList[focus].username
  );
  const b64 = useAppSelector(
    (state) => state.user.friendList[focus].profile_b64
  );

  return (
    <>
      <IconButton
        onClick={() => setCollapse(!collapsed)}
        style={{ height: "5vh", width: "50px" }}
      >
        {(collapsed && <ChevronLeft />) || <ChevronRight />}
      </IconButton>
      <ProfilePicture uid={friend_name} imgSrc={b64} width={38} height={38} />
      <Typography
        style={{ paddingLeft: "20px", fontSize: "20px", stroke: "Bold" }}
      >
        {friend_name}
      </Typography>
    </>
  );
}
