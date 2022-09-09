import React from "react";
import axios from "axios";
import { BASE } from "@/constants/endpoints";
import styles from "./SignIn.module.css";
import LoginForm from "@/components/LoginForm/LoginForm";
import LoginBanner from "@/components/LoginBanner/LoginBanner";
import CheckConnectionBackdrop from "@/components/CheckConnectionBackdrop";
import { setUserAuthed, setFriendLatestMessage } from "@/states/user/userSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";

import { SocketContext } from "@/service/Socket";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = React.useState(true);
  const socket = React.useContext(SocketContext);

  React.useEffect(() => {
    console.log("signin page");
    let uid = localStorage.getItem("uid");
    if (uid) {
      uid = JSON.parse(uid);
      axios
        .post(`${BASE}/checkConnection`, {
          uid: uid,
        })
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            dispatch(setUserAuthed(res.data.context));
            navigate("/home");
            socket.emit("conn", res.data.context.id);
            socket.on("message", (msg) => {
              dispatch(setFriendLatestMessage(msg));
            });
          }
        })
        .catch((e) => {
          setOpen(false);
          console.log(e);
        });
    }
    setOpen(false);
  }, []);

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
