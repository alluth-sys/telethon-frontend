import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";

import {
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Link,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import ProfilePicture from "@/components/MessageBox/ProfilePicture";
import AdvanceSettings from "@/components/AdvanceSettings";
import Spacer from "react-spacer";

// Modal
import NameEditModal from "@/components/NameEditModal";

// Translation
import { useTranslation } from "react-i18next";

export default function Settings() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const [language, setLanguage] = React.useState("English");
  const { t, i18n } = useTranslation();

  // Modal States
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExit = () => setOpen(false);

  const setLanguageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  // Detect Language Change
  React.useEffect(() => {
    if (language === "English") {
      i18n.changeLanguage("en");
    } else if (language === "Chinese") {
      i18n.changeLanguage("zh");
    }
  }, [language]);

  return (
    <div className="w-full flex">
      {/* Left */}
      <div className="m-8 w-2/4">
        <div className="m-8 flex w-fit p-8 rounded-xl shadow-xl">
          {/* User Image */}
          <div className="m-4">
            <ProfilePicture
              uid={UserData?.first_name}
              imgSrc={`data:image/jpeg;base64,${UserData?.profile_pic}`}
              width={144}
              height={144}
            />
          </div>
          {/* User Data */}
          <div className="flex justify-center items-center ">
            <div>
              <div className="flex">
                <Typography variant="h4" style={{ fontWeight: 400 }}>
                  {UserData?.last_name} {UserData?.first_name}
                </Typography>
                <Spacer width={"10px"} />
                <IconButton
                  className="hover:opacity-100 opacity-0"
                  onClick={handleOpen}
                >
                  <EditIcon style={{ color: "#3b82f6" }} fontSize={"small"} />
                </IconButton>
                <NameEditModal
                  isOpen={open}
                  handleClose={handleClose}
                  handleClickClose={handleExit}
                  FName={UserData?.first_name}
                  LName={UserData?.last_name}
                />
              </div>
              <div className="flex items-center">
                <Typography style={{ color: "grey" }}>
                  {UserData?.username}
                </Typography>
                <Spacer width={"10px"} />
                <IconButton className="hover:opacity-100 opacity-0">
                  <EditIcon style={{ color: "#3b82f6" }} fontSize={"small"} />
                </IconButton>
              </div>
              <div className="flex items-center">
                <Typography style={{ color: "grey" }}>
                  {`+${UserData?.phone}`}
                </Typography>
                <Spacer width={"10px"} />
                <IconButton className="hover:opacity-100 opacity-0">
                  <EditIcon style={{ color: "#3b82f6" }} fontSize={"small"} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        {/* Language & Font */}
        <div className="m-8 flex">
          <FormControl>
            <FormLabel id="language-buttons-group-label">
              {t("Language")}
            </FormLabel>
            <RadioGroup
              aria-labelledby="language-buttons-group-label"
              defaultValue="English"
              name="radio-buttons-group"
              onChange={setLanguageHandler}
            >
              <FormControlLabel
                value="English"
                control={<Radio />}
                label={t("English")}
              />
              <FormControlLabel
                value="Chinese"
                control={<Radio />}
                label={t("Chinese")}
              />
            </RadioGroup>
          </FormControl>
          <Spacer width={"10%"} />
          <FormControl>
            <FormLabel id="fontsize-buttons-group-label">
              {t("FontSize")}
            </FormLabel>
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
        {/* LINKS */}
        <div className="m-8">
          <Link href="#">
            <Typography style={{ color: "grey" }}>{t("FAQ")}</Typography>
          </Link>
          <Link href="#">
            <Typography style={{ color: "grey" }}>{t("DevInfo")}</Typography>
          </Link>
        </div>
      </div>
      {/* Right */}
      <div className="m-8 w-2/4">
        <AdvanceSettings />
      </div>
    </div>
  );
}
