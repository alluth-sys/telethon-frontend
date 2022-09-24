import React from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { RootState } from "@/app/store";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import SaveIcon from "@mui/icons-material/Save";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { updateUserProfile } from "@/states/user/userSlice";

import Avatar from "@mui/material/Avatar";
import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

type TProps = {
  handleClose:
    | ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    | undefined;
  isOpen: boolean;
  imgSrc: string | undefined;
  handleClickClose: () => void;
};

const client = axios.create({
  baseURL: BASE,
});

export default function ProfilePictureEditModal({
  handleClose,
  handleClickClose,
  isOpen,
  imgSrc,
}: TProps) {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [image, setImage] = React.useState<string | undefined>(imgSrc);

  const handleButtonClick = async () => {
    if (success) {
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const response = await client.post(`/setting/photo/${UserData?.id}`, {
        photo: image?.split(",")[1],
      });

      if (response.data.code === 200) {
        dispatch(
          updateUserProfile({
            image: image?.split(",")[1],
          })
        );
        setSuccess(true);
      }

      setLoading(false);
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
      setLoading(false);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setSuccess(false);
    setLoading(false);
    setImage(imgSrc);
  }, [isOpen]);

  return (
    <div>
      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={style}>
          <IconButton
            sx={{ top: "5%", left: "85%", position: "absolute" }}
            onClick={handleClickClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2">
            Edit Profile Picture
          </Typography>
          <Divider />
          <div className="flex items-center justify-center w-full">
            <Avatar src={image} sx={{ width: 144, height: 144, mt: 3 }} />
          </div>

          <div className="flex w-full justify-center items-center mt-5">
            <Button component="label" endIcon={<FileUploadIcon />}>
              Upload
              <input
                type="file"
                accept="image/png, image/jpeg"
                id="upload-button"
                className="hidden"
                onChange={(event) => {
                  const reader = new FileReader();
                  reader.onloadend = function () {
                    const baseString = reader.result;
                    if (typeof baseString === "string") {
                      setImage(baseString);
                    }
                  };
                  // @ts-ignore
                  reader.readAsDataURL(event.target.files[0]);
                }}
              />
            </Button>
          </div>
          <div className="flex w-full items-end flex-col">
            <Fab color="primary" onClick={handleButtonClick}>
              {success ? (
                <CheckIcon />
              ) : loading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                <SaveIcon />
              )}
            </Fab>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
