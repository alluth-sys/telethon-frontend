import React from "react";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { setFriendData, setFilteredData } from "@/states/user/friendSlice";

import { RootState } from "@/app/store";
import axios, { AxiosError } from "axios";
import { BASE } from "@/constants/endpoints";
import { access_token_header } from "@/constants/access_token";

const client = axios.create({
  baseURL: BASE,
});

export default function useFriendList() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const friendData = useAppSelector((state: RootState) => state.friend.data);
  const filteredData = useAppSelector(
    (state: RootState) => state.friend.filteredData
  );
  const dispatch = useAppDispatch();

  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const getUserFriendList = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/channel/list/${UserData?.id}`, {
        headers: access_token_header(),
      });
      if (response.data.code === 200) {
        const data = response.data.context;
        dispatch(
          setFriendData({
            data: response.data.context,
          })
        );

        const classOne = data.filter((item: any) => {
          return item.priority === 0;
        });

        const classTwo = data.filter((item: any) => {
          return item.priority === 1;
        });

        const classThree = data.filter((item: any) => {
          return item.priority === 2;
        });

        var half_classOne = Math.ceil(classOne.length / 2);
        var half_classTwo = Math.ceil(classTwo.length / 2);

        const classOne_left = classOne.slice(0, half_classOne);
        const classOne_right = classOne.slice(half_classOne);
        //console.log(classOne_left, classOne_right);

        const classTwo_left = classTwo.slice(0, half_classTwo);
        const classTwo_right = classTwo.slice(half_classTwo);
        //console.log(classTwo_left, classTwo_right);

        const reorderedArray = [
          ...classOne_left,
          ...classTwo_left,
          ...classThree,
          ...classTwo_right,
          ...classOne_right,
        ];

        dispatch(
          setFilteredData({
            data: reorderedArray,
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

  return {
    loading,
    success,
    friendData,
    filteredData,
    getUserFriendList,
  };
}
