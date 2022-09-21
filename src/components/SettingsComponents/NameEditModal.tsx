import React from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { updateUserName } from "@/states/user/userSlice";
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
  FName: string | undefined;
  LName: string | undefined;
  handleClickClose: () => void;
};

const client = axios.create({
  baseURL: BASE,
});

export default function NameEditModal({
  handleClose,
  handleClickClose,
  isOpen,
  FName,
  LName,
}: TProps) {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = React.useState<string | undefined>(FName);
  const [lastName, setLastName] = React.useState<string | undefined>(LName);

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleButtonClick = async () => {
    if (success) {
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const response = await client.post(`/setting/profile/${UserData?.id}`, {
        first_name: firstName,
        last_name: lastName,
      });

      if (response.data.code === 200) {
        console.log(response.data);
        dispatch(
          updateUserName({
            firstname: firstName,
            lastname: lastName,
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
            Edit Name
          </Typography>
          <Divider />
          <TextField
            label="First Name"
            variant="outlined"
            sx={{ mt: 2 }}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <Spacer height={"10px"} />
          <TextField
            label="Last Name"
            variant="outlined"
            sx={{ mt: 2 }}
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
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
