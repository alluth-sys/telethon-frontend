import React from "react";
import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";
import styles from "./SignIn.module.css";
import LoginForm from "@/components/LoginForm/LoginForm";
import LoginBanner from "@/components/LoginBanner/LoginBanner";
import CheckConnectionBackdrop from "@/components/Connection/CheckConnectionBackdrop";
import { setUserAuthed } from "@/states/user/userSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";

import { SocketContext } from "@/service/Socket";
import { access_token_header } from "@/constants/access_token";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = React.useState(false);
  const socket = React.useContext(SocketContext);

  const strict_mode_ref = React.useRef(false);
  React.useEffect(() => {
    if (!strict_mode_ref.current) {
      checkConnection();
      strict_mode_ref.current = true;
    } else {
      return;
    }
  }, []);

  const checkConnection = async () => {
    setOpen(true);
    let uid = localStorage.getItem("uid");
    let access_token = localStorage.getItem("access_token");
    if (uid) {
      try {
        const response = await axios.post(
          `${BASE}/checkConnection`,
          {
            uid: uid,
          },
          { headers: access_token_header() }
        );
        if (response.data.code == 200) {
          dispatch(setUserAuthed(response.data.context));
          localStorage.setItem(
            "access_token",
            JSON.stringify(response.data.context.access_token)
          );
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
    }
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <LoginBanner />
      </div>
      <div className={styles.right}>
        <LoginForm />
      </div>
      <CheckConnectionBackdrop open={isOpen} />
    </div>
  );
}
