import React from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { RootState } from "@/app/store";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import IconButton from "@mui/material/IconButton";
import ProfilePictureEditModal from "./ProfilePictureEditModal";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: "10%",
    height: "10%",
    borderRadius: "50%",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

type TProps = {
  uid: string | undefined;
  imgSrc: string;
  width: number;
  height: number;
};

export default function ProfileAvatar({ uid, imgSrc, width, height }: TProps) {
  const UserData = useAppSelector((state: RootState) => state.user.data);

  //Profile Picture Edit Modal States
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const handleProfileModalOpen = () => setProfileModalOpen(true);
  const handleProfileModalClose = () => setProfileModalOpen(false);
  const handleProfileModalClickClose = () => setProfileModalOpen(false);

  return (
    <>
      <div className="h-fit w-fit rounded-full relative ">
        <div className="rounded-full hover:opacity-70">
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              alt={uid}
              src={imgSrc}
              sx={{ width: width, height: height }}
            />
          </StyledBadge>
          <div className="absolute top-0 left-0 w-36 h-36 rounded-full flex justify-center items-center opacity-0 hover:opacity-70">
            <IconButton onClick={handleProfileModalOpen}>
              <ChangeCircleIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      </div>
      <ProfilePictureEditModal
        isOpen={profileModalOpen}
        handleClose={handleProfileModalClose}
        handleClickClose={handleProfileModalClickClose}
        imgSrc={`data:image/jpeg;base64,${UserData?.profile_pic}`}
      />
    </>
  );
}
