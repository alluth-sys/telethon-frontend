import React from "react";
import styles from "./Components/UserBubble.module.css";
import "react-bubble-ui/dist/index.css";
// @ts-ignore
import BubbleUI from "react-bubble-ui";
import CircularProgress from "@mui/material/CircularProgress";

import useFriendList from "./Hooks/useFriendList";
import UserBubble from "./Components/UserBubble";

const options = {
  size: 150,
  minSize: 50,
  gutter: 100,
  provideProps: true,
  numCols: 5,
  fringeWidth: 160,
  yRadius: 130,
  xRadius: 220,
  cornerRadius: 50,
  showGuides: false,
  compact: false,
  gravitation: 5,
};

export default function BubblePanel() {
  const { friendData, getUserFriendList } = useFriendList();

  React.useEffect(() => {
    if (friendData) return;
    getUserFriendList();
  }, []);

  const getFriends = () => {
    if (friendData) {
      return friendData
        .filter((friend) => friend.unread_count > 0)
        .map((friend, index) => {
          return <UserBubble {...friend} key={index} />;
        });
    }
  };

  const UserBubbles = getFriends();

  if (friendData) {
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
