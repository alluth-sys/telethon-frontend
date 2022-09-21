import React from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { updateUsername } from "@/states/user/userSlice";
import { RootState } from "@/app/store";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Spacer from "react-spacer";
import CircularProgress from "@mui/material/CircularProgress";
import SaveIcon from "@mui/icons-material/Save";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";

import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";

const client = axios.create({
  baseURL: BASE,
});

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
  username: string | undefined;
  handleClickClose: () => void;
};

// TODO: Dispatch to user data

export default function UsernameEditModal({
  handleClose,
  handleClickClose,
  isOpen,
  username,
}: TProps) {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const dispatch = useAppDispatch();
  const [uname, setUname] = React.useState<string | undefined>(username);

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleButtonClick = async () => {
    if (success) {
      setSuccess(false);
      setHasError(false);
      return;
    }

    setLoading(true);
    setHasError(false);
    try {
      const response = await client.post(`/setting/username/${UserData?.id}`, {
        name: uname,
      });

      if (response.data.code === 200) {
        console.log(response.data);
        setSuccess(true);
        dispatch(
          updateUsername({
            uname: uname,
          })
        );
      }
      setLoading(false);
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
      setHasError(true);
      setLoading(false);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setSuccess(false);
    setHasError(false);
    setLoading(false);
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
            Edit Username
          </Typography>
          <Divider />
          <TextField
            label="Username"
            variant="outlined"
            value={uname}
            sx={{ mt: 2 }}
            onChange={(e) => {
              setUname(e.target.value);
            }}
          />
          <div className="flex w-full">
            {hasError ? (
              <div className="flex w-full items-center justify-items-center">
                <ErrorIcon sx={{ color: "#c62828" }} />
                <Typography variant="subtitle2" sx={{ color: "#c62828" }}>
                  username unavailable
                </Typography>
              </div>
            ) : null}
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
          </div>
        </Box>
      </Modal>
    </div>
  );
}
