import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";

const client = axios.create({
  baseURL: BASE,
});

export default function useFriendList() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] =
    React.useState<
      {
        id: string;
        name: string;
        priority: number;
        b64: string;
        unread_count: number;
      }[]
    >();

  const getUserFriendList = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/channel/list/${UserData?.id}`);
      if (response.data.code === 200) {
        setData(response.data.context);
        console.log(response.data.context);
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

  return { loading, success, data, getUserFriendList };
}
