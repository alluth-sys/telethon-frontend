import React from "react";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { setFriendData } from "@/states/user/friendSlice";

import { RootState } from "@/app/store";
import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";

const client = axios.create({
  baseURL: BASE,
});

export default function useFriendList() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const friendData = useAppSelector((state: RootState) => state.friend.data);
  const dispatch = useAppDispatch();

  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // const [data, setData] = React.useState<
  //   {
  //     id: string;
  //     name: string;
  //     priority: number;
  //     b64: string;
  //     unread_count: number;
  //   }[]
  // >();

  const getUserFriendList = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/channel/list/${UserData?.id}`);
      if (response.data.code === 200) {
        dispatch(
          setFriendData({
            data: response.data.context,
          })
        );

        setLoading(false);
        setSuccess(true);
      }
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
    }
    setLoading(false);
  };

  return { loading, success, friendData, getUserFriendList };
}
