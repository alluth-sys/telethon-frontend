import React from "react";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@material-ui/core";
import Spacer from "react-spacer";

type TProps = { b64: string; name: string; id: number };

export default function ContactProfile(props: TProps) {
  return (
    <div className="flex justify-center items-center">
      <Avatar alt={props.name} src={`data:image/jpeg;base64,${props.b64}`} />
      <Spacer width={"10px"} />
      <Typography>{props.name}</Typography>
    </div>
  );
}
