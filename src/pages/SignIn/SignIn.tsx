import React from "react";
import axios from "axios";
import { BASE } from "@/constants/endpoints";
import styles from "./SignIn.module.css";
import LoginForm from "@/components/LoginForm/LoginForm";
import LoginBanner from "@/components/LoginBanner/LoginBanner";
import CheckConnectionBackdrop from "@/components/CheckConnectionBackdrop";
import { setUserAuthed } from "@/states/user/userSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = React.useState(true);

  React.useEffect(() => {
    let uid = localStorage.getItem("uid");
    if (uid) {
      uid = JSON.parse(uid);
      axios
        .post(`${BASE}/checkConnection`, {
          uid: uid,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(setUserAuthed(res.data));
            navigate("/home");
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
