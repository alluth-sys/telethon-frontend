import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Typography } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import Spacer from "react-spacer";

export default function Settings() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const [language, setLanguage] = React.useState("English");

  const setLanguageHandler = () => {};

  return (
    <div className="w-full">
      <div className="m-8 flex w-fit p-8 rounded-xl hover:shadow-xl transition-all duration-200 ease-linear">
        <div className="m-4">
          <img
            src={`data:image/jpeg;base64,${UserData?.profile_pic}`}
            className="w-36 h-36 rounded-full"
          />
        </div>
        <div className="flex justify-center items-center ">
          <div>
            <Typography variant="h4" style={{ fontWeight: 400 }}>
              {UserData?.last_name}
              {UserData?.first_name}
            </Typography>
            <Typography style={{ color: "grey" }}>
              {UserData?.username}
            </Typography>
            <Typography
              style={{ color: "grey" }}
            >{`+${UserData?.phone}`}</Typography>
          </div>
        </div>
        <div className="flex justify-end items-end pl-12">
          <EditIcon style={{ color: "#3b82f6" }} />
        </div>
      </div>
      <div className="m-8 flex">
        <FormControl>
          <FormLabel id="language-buttons-group-label">Language</FormLabel>
          <RadioGroup
            aria-labelledby="language-buttons-group-label"
            defaultValue="English"
            name="radio-buttons-group"
            onChange={(event) => {
              setLanguage(event.target.value);
            }}
          >
            <FormControlLabel
              value="English"
              control={<Radio />}
              label="English"
            />
            <FormControlLabel
              value="Chinese"
              control={<Radio />}
              label="Chinese"
            />
          </RadioGroup>
        </FormControl>
        <Spacer width={"10%"} />
        <FormControl>
          <FormLabel id="fontsize-buttons-group-label">Font Size</FormLabel>
          <RadioGroup
            aria-labelledby="fontsize-buttons-group-label"
            defaultValue="1"
            name="radio-buttons-group"
            onChange={(event) => {
              setLanguage(event.target.value);
            }}
          >
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="1.5" control={<Radio />} label="1.5" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="m-8">
        <Link href="#">
          <Typography style={{ color: "grey" }}>FAQ</Typography>
        </Link>
        <Link href="#">
          <Typography style={{ color: "grey" }}>
            Developer Information
          </Typography>
        </Link>
      </div>
    </div>
  );
}
