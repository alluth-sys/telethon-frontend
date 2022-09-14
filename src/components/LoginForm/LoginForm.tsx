import React from "react";
import styles from "@/components/LoginForm/LoginForm.module.css";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";

// Spacer
import Spacer from "react-spacer";

// Icon
import PhoneIcon from "@mui/icons-material/Phone";
import GppGoodIcon from "@mui/icons-material/GppGood";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";

//Redux
import { setUserAuthed, setFriendLatestMessage } from "@/states/user/userSlice";
import { useAppDispatch } from "@/app/hooks";

// Router
import { useNavigate } from "react-router-dom";

// Constant
import { BASE } from "@/constants/endpoints";

import { SocketContext } from "@/service/Socket";

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = React.useState<String | null>("");
  const [code, setCode] = React.useState("");

  const [onSuccess, setOnSuccess] = React.useState(false);
  const [onLoading, setOnLoading] = React.useState(false);
  const [codeLoading, setCodeLoading] = React.useState(false);

  const socket = React.useContext(SocketContext);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signInHandler = () => {
    setOnLoading(true);
    axios
      .post(`${BASE}/login`, {
        phone: phoneNumber,
      })
      .then((res) => {
        setOnLoading(false);
        if (res.data.code === 200) {
          // Set User Data when signed in without existing sessions
          setOnSuccess(true);
        } else if (res.status === 202) {
          // Set User Data when signed in with existing sessions
          setOnSuccess(true);
          dispatch(setUserAuthed(res.data.context));
          localStorage.setItem("uid", JSON.stringify(res.data.context.id)); // Set User Id for Persistent Login

          navigate("/home");
          socket.emit("conn", res.data.context.id);
          socket.on("message", (msg) => {
            dispatch(setFriendLatestMessage(msg));
          });
        }
      });
  };

  const codeVerificationHandler = () => {
    setCodeLoading(true);
    axios
      .post(`${BASE}/verify`, {
        phone: phoneNumber,
        code: code,
      })
      .then((res) => {
        setCodeLoading(false);
        dispatch(setUserAuthed(res.data.context)); // Set User Data
        localStorage.setItem("uid", JSON.stringify(res.data.context.id)); // Set User Id for Persistent Login
        navigate("/home");
      })
      .catch((e) => {
        setCodeLoading(false);
        console.log(e);
      });
  };

  return (
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
  );
}
