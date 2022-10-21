import { useAppSelector } from "@/app/hooks";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

type ReplyAreaProps = { setReplying: Function };
export default function ReplyArea({ setReplying }: ReplyAreaProps) {
  const focus = useAppSelector((state) => state.user.focus);
  const selectedMessageId = useAppSelector(
    (state) => state.user.selectedMessageId
  );
  const selectedMessageContent = useAppSelector(
    (state) =>
      state.user.friendList[focus].chat_history[selectedMessageId[0]]?.content
  );

  return (
    <>
      <div
        style={{
          height: "50px",
          width: "70%",
          backgroundColor: "white",
          display: "flex",
          alignSelf: "center",
          borderRadius: "10px 10px 0 0",
          alignItems: "center",
          borderColor: "black",
          borderWidth: "2px 2px 0px 2px",
          padding: "0 20px 0px 20px",
        }}
      >
        <div style={{ width: "8%", display: "flex", alignItems: "center" }}>
          <ReplyIcon />
          <IconButton
            style={{ alignItems: "center", rotate: "90deg" }}
            size="medium"
          >
            <HorizontalRuleIcon />
          </IconButton>
        </div>
        <div
          style={{
            justifyContent: "space-between",
            width: "80%",
            display: "flex",
            paddingLeft: "50px",
          }}
        >
          {selectedMessageContent}
          <CloseIcon
            onClick={() => setReplying(false)}
            style={{ alignSelf: "content-end" }}
          />
        </div>
      </div>
    </>
  );
}
