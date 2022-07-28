import { useState } from "react";

import styles from "./SignIn.module.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Spacer from "react-spacer";

// Icons
import PhoneIcon from "@mui/icons-material/Phone";
import GppGoodIcon from "@mui/icons-material/GppGood";
import TelegramIcon from "@mui/icons-material/Telegram";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";

// Restful
import axios from "axios";

//Redux
import { setUserAuthed, setUserData } from "@/states/user/userSlice";
import { onConnection } from "@/states/socket/socketSlice";
import { useAppDispatch } from "@/app/hooks";

// Router
import { useNavigate } from "react-router-dom";

// Base URL
const base = "http://127.0.0.1:5000";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [onSuccess, setOnSuccess] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  const signInHandler = () => {
    setOnLoading(true);
    axios
      .post(`${base}/login`, {
        phone: phoneNumber,
      })
      .then((res) => {
        setOnLoading(false);
        if (res.data.code === 200) {
          setOnSuccess(true);
        }
      });
  };

  const codeVerificationHandler = () => {
    setCodeLoading(true);
    axios
      .post(`${base}/verify`, {
        phone: phoneNumber,
        code: code,
      })
      .then((res) => {
        setCodeLoading(false);
        dispatch(setUserAuthed());
        dispatch(setUserData(res.data));
        dispatch(onConnection());

        navigate("/home");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <div className={styles.logo}>
            <Typography variant="h2">Telethon</Typography>
            <Spacer width={"10px"} />
            <TelegramIcon style={{ fontSize: 60 }} />
          </div>
          <Typography variant="subtitle1" style={{ color: "gray" }}>
            Chatting experience reinovated
          </Typography>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles["input-form"]}>
          <TextField
            className="w-56"
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {onSuccess ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : null}
                </InputAdornment>
              ),
            }}
          />
          <Spacer height={"5%"} />
          <LoadingButton
            loading={onLoading}
            variant="contained"
            endIcon={<SendIcon />}
            style={{ width: "60%" }}
            onClick={signInHandler}
          >
            Send
          </LoadingButton>

          <Spacer height={"25%"} />
          <TextField
            className="w-56"
            label="Code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GppGoodIcon />
                </InputAdornment>
              ),
            }}
          />
          <Spacer height={"5%"} />
          <LoadingButton
            loading={codeLoading}
            disabled={!onSuccess}
            variant="contained"
            style={{ width: "60%" }}
            onClick={codeVerificationHandler}
            endIcon={<CheckCircleIcon />}
          >
            Verify
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
