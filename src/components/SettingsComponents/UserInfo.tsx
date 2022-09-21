import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";

import { Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhoneIcon from "@mui/icons-material/Phone";

import ProfilePicture from "@/components/MessageBox/ProfilePicture";
import Spacer from "react-spacer";

// Modal
import NameEditModal from "@/components/SettingsComponents/NameEditModal";
import UsernameEditModal from "./UsernameEditModal";

export default function UserInfo() {
  const UserData = useAppSelector((state: RootState) => state.user.data);

  // Edit Name Modal States
  const [nameModalOpen, setNameModalOpen] = React.useState(false);
  const handleNameEditOpen = () => setNameModalOpen(true);
  const handleNameEditClose = () => setNameModalOpen(false);
  const handleNameEditClickClose = () => setNameModalOpen(false);

  // Usernmae Edit Modal States
  const [unameModalOpen, setUnameModalOpen] = React.useState(false);
  const handleUnameEditOpen = () => setUnameModalOpen(true);
  const handleUnameEditClose = () => setUnameModalOpen(false);
  const handleUnameEditClickClose = () => setUnameModalOpen(false);

  return (
    <div className="m-8 flex w-fit p-8 rounded-xl shadow-xl">
      {/* User Image */}
      <div className="m-4">
        <ProfilePicture
          uid={UserData?.first_name}
          imgSrc={`data:image/jpeg;base64,${UserData?.profile_pic}`}
          width={144}
          height={144}
        />
      </div>
      {/* User Data */}
      <div className="flex justify-center items-center ">
        <div>
          <div className="flex">
            <Typography variant="h4" style={{ fontWeight: 400 }}>
              {UserData?.last_name} {UserData?.first_name}
            </Typography>
            <Spacer width={"10px"} />
            <IconButton
              className="hover:opacity-100 opacity-0"
              onClick={handleNameEditOpen}
            >
              <EditIcon style={{ color: "#3b82f6" }} fontSize={"small"} />
            </IconButton>
            <NameEditModal
              isOpen={nameModalOpen}
              handleClose={handleNameEditClose}
              handleClickClose={handleNameEditClickClose}
              FName={UserData?.first_name}
              LName={UserData?.last_name}
            />
          </div>
          <div className="flex items-center">
            <AssignmentIndIcon fontSize="small" style={{ color: "grey" }} />
            <Spacer width={"5px"} />
            <Typography style={{ color: "grey" }}>
              {UserData?.username}
            </Typography>
            <Spacer width={"10px"} />
            <IconButton
              className="hover:opacity-100 opacity-0"
              onClick={handleUnameEditOpen}
            >
              <EditIcon style={{ color: "#3b82f6" }} fontSize={"small"} />
            </IconButton>
            <UsernameEditModal
              isOpen={unameModalOpen}
              handleClose={handleUnameEditClose}
              handleClickClose={handleUnameEditClickClose}
              username={UserData?.username}
            />
          </div>
          <div className="flex items-center">
            <PhoneIcon style={{ color: "grey" }} fontSize="small" />
            <Spacer width={"5px"} />
            <Typography style={{ color: "grey" }}>
              {`+${UserData?.phone}`}
            </Typography>
            <Spacer width={"10px"} />
            <IconButton className="hover:opacity-100 opacity-0">
              <EditIcon style={{ color: "#3b82f6" }} fontSize={"small"} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
