import { useEffect, useState } from "react";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

import { IconButton } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { TrendingUpRounded } from "@material-ui/icons";

export default function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [media, setMedia] = useState<MediaRecorder | null>(null);

  let chunk: any = [];

  useEffect(() => {
    if (media == null) {
      return;
    }
    media.ondataavailable = (e) => {
      chunk.push(e.data);
      console.log(e);
    };
    media.stop = () => {
      console.log("media stop");
    };
  }, [media]);

  // useEffect(() => {
  //   if (media == null) {
  //     return;
  //   }
  //   if (isRecording) {
  //     media!.start();
  //     console.log(media!.state);
  //     console.log("recorder started");
  //     media!.ondataavailable = (e) => {
  //       chunk.push(e.data);
  //       console.log("chunk ", chunk);
  //     };
  //   } else {
  //     if (media!.state != "inactive") {
  //       media!.stop();
  //     }
  //     console.log(media!.state);
  //     console.log("recorder stopped");

  //     media!.onstop = () => {
  //       const audio = document.createElement("audio");
  //       audio.setAttribute("controls", "");

  //       console.log("chunk in blb", chunk);
  //       const blob = new Blob(chunk, { type: "audio/ogg; codecs=opus" });
  //       console.log("blob", blob);

  //       chunk = [];

  //       const audioURL = window.URL.createObjectURL(blob);
  //       audio.src = audioURL;
  //     };
  //   }
  // }, [isRecording]);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices
        .getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
          }
        )
        // Success callback
        .then((stream) => {
          setMedia(new MediaRecorder(stream));
        })
        // Error callback
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }, []);

  const startStream = () => {
    console.log("start");
    media?.start();
    setIsRecording(!isRecording);
  };

  const stopStream = () => {
    console.log("stop");
    media?.stop();
    setIsRecording(!isRecording);
  };

  return (
    <div className="my-8 mx-5 navigate relative">
      <IconButton
        disabled={isRecording}
        style={{
          position: "absolute",
          top: -7,
          right: -10,
          visibility: isRecording ? "hidden" : "visible",
        }}
        id="recorder"
        onClick={() => {
          startStream();
        }}
      >
        <KeyboardVoiceIcon />
      </IconButton>
      <IconButton
        disabled={!isRecording}
        style={{
          position: "absolute",
          top: -7,
          right: -10,
          visibility: isRecording ? "visible" : "hidden",
        }}
        id="stopper"
        onClick={() => {
          stopStream();
        }}
      >
        <StopCircleIcon />
      </IconButton>
    </div>
  );
}
