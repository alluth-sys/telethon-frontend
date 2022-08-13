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
import { setUserAuthed } from "@/states/user/userSlice";
import { useAppDispatch } from "@/app/hooks";

// Router
import { useNavigate } from "react-router-dom";

const base = "http://127.0.0.1:5000";

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [code, setCode] = React.useState("");

  const [onSuccess, setOnSuccess] = React.useState(false);
  const [onLoading, setOnLoading] = React.useState(false);
  const [codeLoading, setCodeLoading] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
        dispatch(setUserAuthed(res.data));
        console.log(res.data);
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
