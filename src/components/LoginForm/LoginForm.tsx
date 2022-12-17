import React from "react";
import styles from "@/components/LoginForm/LoginForm.module.css";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import axios, { AxiosError } from "axios";

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

// Constant
import { BASE } from "@/constants/endpoints";

import { SocketContext } from "@/service/Socket";
import { access_token_header } from "@/constants/access_token";

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = React.useState<String | null>("");
  const [code, setCode] = React.useState("");

  const [onSuccess, setOnSuccess] = React.useState(false);
  const [onLoading, setOnLoading] = React.useState(false);
  const [codeLoading, setCodeLoading] = React.useState(false);

  const socket = React.useContext(SocketContext);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signInHandler = async () => {
    setOnLoading(true);
    setOnSuccess(false);
    try {
      const response = await axios.post(
        `${BASE}/login`,
        {
          phone: phoneNumber,
        },
        { headers: access_token_header() }
      );

      if (response.data.code == 200) {
        setOnSuccess(true);
      } else if (response.data.code == 202) {
        setOnSuccess(true);
        dispatch(setUserAuthed(response.data.context));
        if (response.data.context.access_token !== undefined) {
          localStorage.setItem(
            "access_token",
            JSON.stringify(response.data.context.access_token)
          );
        }
        localStorage.setItem("uid", JSON.stringify(response.data.context.id));
        navigate("/home");
        socket.emit("conn", response.data.context.id);
      }
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
    }
    setOnLoading(false);
  };

  const codeVerificationHandler = async () => {
    setCodeLoading(true);
    try {
      const response = await axios.post(`${BASE}/verify`, {
        phone: phoneNumber,
        code: code,
      });
      if (response.data.code == 200) {
        dispatch(setUserAuthed(response.data.context));
        if (response.data.context.access_token !== undefined) {
          localStorage.setItem(
            "access_token",
            JSON.stringify(response.data.context.access_token)
          );
        }
        localStorage.setItem("uid", JSON.stringify(response.data.context.id));
        navigate("/home");
        socket.emit("conn", response.data.context.id);
      }
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
    }
    setCodeLoading(false);
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
