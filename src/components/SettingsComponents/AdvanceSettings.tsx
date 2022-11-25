import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";

import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Spacer from "react-spacer";
import { Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fab from "@mui/material/Fab";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";

import { BASE } from "@/constants/endpoints";

import axios, { AxiosError } from "axios";

const client = axios.create({
  baseURL: BASE,
});

const typeList: string[] = [
  "StatusTimestamp",
  "ChatInvite",
  "PhoneCall",
  "PhoneP2P",
  "Forwards",
  "ProfilePhoto",
  "PhoneNumber",
  "AddedByPhone",
];

interface IJSON {
  [index: string]: number;
}

export default function AdvanceSettings() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const [onLoad, setOnLoad] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [saveLoad, setSaveLoad] = React.useState(false);

  const [checked, setChecked] = React.useState<string[]>([]);

  const fetchData = async () => {
    setOnLoad(true);
    try {
      const response = await client.get(`/setting/privacy/${UserData?.id}`);

      let i = 0;
      for (const privacy of response.data.context) {
        if (
          privacy.rules[0]._ === "PrivacyValueAllowAll" ||
          privacy.rules[0]._ === "PrivacyValueAllowContacts"
        ) {
          checked.push(typeList[i]);
        }
        i++;
      }
      setOnLoad(false);
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
      setOnLoad(false);
    }
  };
  const onSave = async () => {
    if (success) {
      setSuccess(false);
      return;
    }

    setSaveLoad(true);

    let settingOptions: IJSON = {};

    for (const type of typeList) {
      settingOptions[type] = checked.indexOf(type) == -1 ? 0 : 1;
    }

    try {
      const response = await client.post(`/setting/privacy/${UserData?.id}`, {
        ...settingOptions,
      });
      if (response.data.code === 200) {
        setSaveLoad(false);
        setSuccess(true);
      }
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
      setSaveLoad(false);
    }
    setSaveLoad(false);
  };

  const handleToggle = async (type: string) => {
    const currentIndex = checked.indexOf(type);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(type);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  // Fetch Settings Data
  React.useEffect(() => {
    fetchData();
  }, []);

  if (!onLoad) {
    return (
      <div className="bg-white p-6 rounded-xl">
        <Typography variant="h6">Advance Settings</Typography>
        <Divider />
        <Spacer height={"15px"} />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={checked.indexOf("StatusTimestamp") != -1}
                onChange={() => {
                  handleToggle("StatusTimestamp");
                }}
              />
            }
            className="p-2 w-fit"
            label="Status Timestamp"
          />
          <Typography color={"gray"} fontSize="small">
            Whether users can see your last active timestamp
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={checked.indexOf("ChatInvite") != -1}
                onChange={() => {
                  handleToggle("ChatInvite");
                }}
              />
            }
            label="Chat Invite"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether you can be invited to chats
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={checked.indexOf("PhoneCall") != -1}
                onChange={() => {
                  handleToggle("PhoneCall");
                }}
              />
            }
            label="Phone Call"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether you will accept phone calls
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={checked.indexOf("PhoneP2P") != -1}
                onChange={() => {
                  handleToggle("PhoneP2P");
                }}
              />
            }
            label="Phone P2P"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether you allow P2P communication during VoIP calls
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={checked.indexOf("Forwards") != -1}
                onChange={() => {
                  handleToggle("Forwards");
                }}
              />
            }
            label="Forwards"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether messages forwarded from you will be anonymous
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={checked.indexOf("ProfilePhoto") != -1}
                onChange={() => {
                  handleToggle("ProfilePhoto");
                }}
              />
            }
            label="Profile Photo"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether people will be able to see your profile picture
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={checked.indexOf("PhoneNumber") != -1}
                onChange={() => {
                  handleToggle("PhoneNumber");
                }}
              />
            }
            label="Phone Number"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether people will be able to see your phone number
          </Typography>
        </FormGroup>
        <div className="flex w-full items-end justify-items-end flex-col mt-8">
          <Fab color="primary" onClick={onSave}>
            {success ? (
              <CheckIcon />
            ) : !saveLoad ? (
              <SaveIcon />
            ) : (
              <CircularProgress sx={{ color: "white" }} />
            )}
          </Fab>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
}
