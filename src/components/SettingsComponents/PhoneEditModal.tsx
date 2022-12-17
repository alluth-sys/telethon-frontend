import React from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { RootState } from "@/app/store";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Spacer from "react-spacer";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";

import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";
import { access_token_header } from "@/constants/access_token";

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
  phoneNumber: string | undefined;
  handleClickClose: () => void;
};

const client = axios.create({
  baseURL: BASE,
});

export default function PhoneEditModal({
  handleClose,
  handleClickClose,
  isOpen,
  phoneNumber,
}: TProps) {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [phone, setPhone] = React.useState<string | undefined>(phoneNumber);

  const handleButtonClick = async () => {
    if (success) {
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const response = await client.post(`/setting/profile/${UserData?.id}`, {
        headers: access_token_header(),
      });

      if (response.data.code === 200) {
        console.log(response.data);
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

    if (phoneNumber && phoneNumber.includes("+886")) {
      const newPhone = "0" + phoneNumber.slice(4);
      setPhone(newPhone);
    }
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
            Phone Number Edit
          </Typography>
          <Divider />
          <div className="flex w-fit justify-center items-center">
            <TextField
              value={phone}
              sx={{ my: 2, mr: 2 }}
              label="Phone Number"
            />
            <Fab color="primary">
              <SwapHorizIcon />
            </Fab>
          </div>
          <div className="flex w-fit justify-center items-center">
            <TextField
              value={""}
              sx={{ my: 2, mr: 2 }}
              label="Verification Code"
              disabled
            />
            <Fab color="primary" disabled>
              <SendIcon />
            </Fab>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
