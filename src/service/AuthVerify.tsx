import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BASE } from "@/constants/endpoints";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { RootState } from "@/app/store";
import axios, { AxiosError } from "axios";
import { access_token_header } from "@/constants/access_token";
import { setUserLoggedOut } from "@/states/user/userSlice";

const parseJWT = (accessToken: string) => {
  try {
    const token = accessToken.split(" ")[1];
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (e) {
    alert(e);
  }
};

export default function AuthVerify() {
  let location = useLocation();
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const SignOutHandler = async () => {
    try {
      const response = await axios.post(
        `${BASE}/logout`,
        {
          uid: UserData?.id,
        },
        { headers: access_token_header() }
      );

      if (response.data.code === 200) {
        console.log(response);
        dispatch(setUserLoggedOut());
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
    }
  };

  useEffect(() => {
    const user: string | null = localStorage.getItem("access_token");
    let accessToken = "";

    if (user) {
      accessToken = JSON.parse(user);
      const payload = parseJWT(accessToken);
      if (payload.exp * 1000 < Date.now()) {
        SignOutHandler();
      }
    }
  }, [location]);

  return <div></div>;
}
