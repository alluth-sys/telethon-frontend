import { useAppSelector } from "@/app/hooks";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { Typography } from "@mui/material";

type ReplyAreaProps = { setReplying: Function };
export default function ReplyArea({ setReplying }: ReplyAreaProps) {

  const selectedMessageId = useAppSelector(
    (state) => state.user.selectedMessageId
  );

  let selectedMessageChannel: number;
  let selectedMessageIdInChannel: number;
  let selectedMessageContent: string | undefined;

  if (selectedMessageId.length > 0) {
    selectedMessageChannel = parseInt(selectedMessageId[0].split("_")[0]);
    selectedMessageIdInChannel = parseInt(selectedMessageId[0].split("_")[1]);

    selectedMessageContent = useAppSelector(
      (state) =>
        state.user.friendList[selectedMessageChannel].chat_history[
          selectedMessageIdInChannel
        ]?.content
    );
  }

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
          padding: "0 10px 0px 20px",
        
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
            height: "25px",
            overflowY:"clip",
            // justifyContent: "space-between",
            width: "40vw",
            display: "flex",
            paddingLeft: "50px",
            textOverflow:"ellipsis"
          }}
        >
          <Typography>
            {selectedMessageContent}
            </Typography>
        </div>
          <CloseIcon
            onClick={() => setReplying(false)}
            style={{ alignSelf: "content-end" }}
          />
      </div>
    </>
  );
}
