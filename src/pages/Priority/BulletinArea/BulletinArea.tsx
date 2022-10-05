import { useAppSelector } from "@/app/hooks";
import MessageBox from "@/components/MessageBox/MessageBox";
import OptionalCard from "@/pages/Chat/MessageArea/OptionalCard/OptionalCard";

var scrollTimer = -1;
const handleOnScroll = () => {
  var curr = document.getElementById("BulletinArea");

  curr!.className = "scrolling-class grid";

  if (scrollTimer != -1) {
    clearTimeout(scrollTimer);
  }

  scrollTimer = window.setTimeout(() => {
    curr!.className = "message-area-scrollbar grid";
  }, 1000);
};

export default function BulletinArea() {
  const important_messages = useAppSelector(
    (state) => state.user.importantMessages
  );

  return (
    <>
      <div
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          position: "relative",
        }}
        className="message-area-scrollbar grid"
        id="BulletinArea"
        onScroll={handleOnScroll}
      >
        <div style={{ justifySelf: "center", width: "100%" }} className="grid">
          {Object.entries(important_messages).map(([key, index]) => {
            return (
              <div className="grid" key={`${key.toString()}_div`}>
                <MessageBox message={index} key={key.toString()} />
              </div>
            );
          })}
        </div>
      </div>
      <OptionalCard />
    </>
  );
}
