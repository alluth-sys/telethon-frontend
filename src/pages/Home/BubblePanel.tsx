import React from "react";
import styles from "./Components/UserBubble.module.css";
import "react-bubble-ui/dist/index.css";
// @ts-ignore
import BubbleUI from "react-bubble-ui";
import CircularProgress from "@mui/material/CircularProgress";

import useFriendList from "./Hooks/useFriendList";
import UserBubble from "./Components/UserBubble";

import { RootState } from "@/app/store";
import { useAppSelector } from "@/app/hooks";

const options = {
  size: 150,
  minSize: 50,
  gutter: 100,
  provideProps: true,
  // TODO: Chnage base on screen width
  numCols: 4,
  fringeWidth: 160,
  yRadius: 130,
  xRadius: 220,
  cornerRadius: 50,
  showGuides: false,
  compact: false,
  gravitation: 5,
};

export default function BubblePanel() {
  const { filteredData, getUserFriendList } = useFriendList();
  const filterShowRank = useAppSelector(
    (state: RootState) => state.user.filterShowRank
  );

  React.useEffect(() => {
    if (filteredData) return;
    getUserFriendList();
  }, []);

  const getFriends = () => {
    if (filteredData) {
      return filteredData
        .filter((friend) => {
          let rank: number = 0;
          if (filterShowRank === "All") {
            rank = -1;
          } else if (filterShowRank === "Rank3") {
            rank = 2;
          } else if (filterShowRank === "Rank2") {
            rank = 1;
          } else if (filterShowRank === "Rank1") {
            rank = 0;
          }

          if (rank === -1) {
            return friend.unread_count > 0;
          }

          return friend.unread_count > 0 && friend.priority === rank;
        })
        .map((friend, index) => {
          return <UserBubble {...friend} key={index} />;
        });
    }
  };

  const UserBubbles = getFriends();

  if (filteredData) {
    return (
      <BubbleUI options={options} className={styles.myBubbleUI}>
        {UserBubbles}
      </BubbleUI>
    );
  } else {
    return (
      <div className="w-full h-full flex justify-center items-center transition-all ease-out duration-1000">
        <CircularProgress />
      </div>
    );
  }
}
