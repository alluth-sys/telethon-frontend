import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import "./InputArea.css";
import InputEmoji from "react-input-emoji";
import { useState } from "react";
import axios from "axios";

export default function InputArea() {
  // state need to be organized :
  //  select:
  //    userid
  //  select:
  //    channel_id
  const [text, setText] = useState("");

  function handleOnEnter(text) {
    console.log(text);
    axios
      .post("http://localhost:5000/send", {
        user_id: "5145920656",
        channel_id: "5145920656",
        message: text,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  function uploadFile(formData,user_id,channel_id) {
    axios.post(
      "http://localhost:5000/sendFile",
      formData,
      { params:{
          user_id,
          channel_id
      },headers: {
        "Content-Type": "multipart/form-data",
      }
    } 
    ).then((response) => console.log(response))
    .catch((error) => console.log(error));
  }

  function importD() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_this) => {
      var data = new FormData()
      data.append('file',input.files[0])
      data.append('user_id',"5145920656")
      data.append('channel_id',"5145920656")
      uploadFile(data,"5145920656","5145920656");
    };
    input.click();
  }

  return (
    <>
      <div className="grid grow ">
        <hr className="border-black border-t-4" />

        <div className="flex justify-center content-center ">
          <AddPhotoAlternateIcon
            className="my-8 mx-5 navigate"
            onClick={importD}
          />
          <InputEmoji
            value={text}
            onChange={setText}
            cleanOnEnter
            onEnter={handleOnEnter}
          />
          <SendIcon className="my-8 mx-5 navigate" onClick={handleOnEnter} />
          <KeyboardVoiceIcon className="my-8 mx-5 navigate" />
        </div>
      </div>
    </>
  );
}
