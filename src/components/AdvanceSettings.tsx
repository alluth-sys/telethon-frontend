import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";

import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Spacer from "react-spacer";
import { Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

import CircularProgress from "@mui/material/CircularProgress";

import { BASE } from "@/constants/endpoints";

import axios, { AxiosError } from "axios";

const client = axios.create({
  baseURL: BASE,
});

export default function AdvanceSettings() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const [settings, setSettings] = React.useState<Array<boolean>>([]);
  const [isLoading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/setting/privacy/${UserData?.id}`);

      for (const privacy of response.data.context) {
        if (
          privacy.rules[0]._ === "PrivacyValueAllowAll" ||
          privacy.rules[0]._ === "PrivacyValueAllowContacts"
        ) {
          settings.push(true);
        } else {
          settings.push(false);
        }
      }

      setLoading(false);
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
      setLoading(false);
    }
  };
  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setLoading(true);
    const val = event.target.checked ? 1 : 0;

    try {
      const response = await client.post(`/setting/privacy/${UserData?.id}`, {
        type: id,
        value: val,
      });
      if (response.data.code === 200) {
        let newSettings = [...settings];
        newSettings[id] = event.target.checked;
        setSettings(newSettings);
        setLoading(false);
      }
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
      setLoading(false);
    }
    setLoading(false);
  };

  // Fetch Settings Data
  React.useEffect(() => {
    fetchData();
  }, []);

  if (!isLoading) {
    return (
      <div>
        <Typography variant="h6">Advance Settings</Typography>
        <Divider />
        <Spacer height={"15px"} />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={settings[0]}
                onChange={(e) => {
                  handleChange(e, 0);
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
                checked={settings[1]}
                onChange={(e) => {
                  handleChange(e, 1);
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
            control={<Switch checked={settings[2]} />}
            label="Phone Call"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether you will accept phone calls
          </Typography>
          <FormControlLabel
            control={<Switch checked={settings[3]} />}
            label="Phone P2P"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether you allow P2P communication during VoIP calls
          </Typography>
          <FormControlLabel
            control={<Switch checked={settings[4]} />}
            label="Forwards"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether messages forwarded from you will be anonymous
          </Typography>
          <FormControlLabel
            control={<Switch checked={settings[5]} />}
            label="Profile Photo"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether people will be able to see your profile picture
          </Typography>
          <FormControlLabel
            control={<Switch checked={settings[6]} />}
            label="Phone Number"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether people will be able to see your phone number
          </Typography>
          <FormControlLabel
            control={<Switch checked={settings[7]} />}
            label="Added By Phone"
            className="p-2 w-fit"
          />
          <Typography color={"gray"} fontSize="small">
            Whether people can add you to their contact list by your phone
            number
          </Typography>
        </FormGroup>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-full w-2/4 flex-col">
        <CircularProgress />
      </div>
    );
  }
}
