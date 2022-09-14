import { Message } from "@/states/user/userSlice";
import { Typography } from "@mui/material";
import "./MessageBox.css";

export default function MessageBox({message }:any) {
  if (message.channel == -1 && message.tag == "null"){
    return <></>
  }
  if (message.tag == "message") {
    return (
      <div className="mb-5 mx-10 justify-center ">
        <div
          style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
          className="bg-black w-fit max-w-sm h-fit rounded-xl"
        >
          <Typography
            style={{ color: "white" }}
            className="font-loader pl-5 pr-5"
            id={message.message_id.toString()}
          >
            {message.data}
          </Typography>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mb-5 mx-10 justify-end">
        <div
          style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
          className="bg-black w-fit max-w-sm h-fit rounded-xl"
        >
          <Typography
            style={{ color: "white" }}
            className="font-loader pl-5 pr-5"
            id={message.message_id.toString()}
          >
            {message.tag}
          </Typography>
        </div>
      </div>
    );
  }
}
