import "./FriendList.css";
import ReactRoundedImage from "react-rounded-image";
import MyPhoto from "./car.jpg";
import ScrollArea from "@xico2k/react-scroll-area";

function wordsFilter(words) {
  if (words.length > 16) {
    return words.slice(0, 16) + "...";
  }
  return words;
}

export default function FriendList() {
  return (
    <div className="flex flex-col grow ">
      <ScrollArea>
        <div style={{ maxHeight: "50px" }}>
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
          <FriendBlock />
        </div>
      </ScrollArea>
    </div>
  );
}

function FriendBlock() {
  return (
    <>
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate"
        style={{ overflowWrap: "break-word" }}
        onClick={() => console.log("navigate to ")}
      >
        <Profile />
        <div
          className="flex ml-4 w-8/12"
          style={{ overflowWrap: "break-word", whiteSpace: "nowrap" }}
        >
          {wordsFilter("sample text111111111")}
        </div>
      </div>
      <hr />
    </>
  );
}

function Profile() {
  return (
    <ReactRoundedImage
      image={MyPhoto}
      roundedColor="#321124"
      imageWidth="50"
      imageHeight="50"
      roundedSize="5"
      borderRadius="70"
    />
  );
}
