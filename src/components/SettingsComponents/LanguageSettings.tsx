import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Link,
  Typography,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import SaveIcon from "@mui/icons-material/Save";

// Translation
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";

import Spacer from "react-spacer";
import { set, setFont, setLang } from "@/states/user/settingSlice";
import { BASE } from "@/constants/endpoints";
import axios, { AxiosError } from "axios";
import { useAppDispatch } from "@/app/hooks";

const client = axios.create({
  baseURL: BASE,
});

export default function LanguageSettings() {
  const UserData = useAppSelector((state: RootState) => state.user.data);
  const uiConfigs = useAppSelector((state: RootState) => state.setting.config);

  const [language, setLanguage] = React.useState(uiConfigs?.lang);
  const [fontSize, setFontSize] = React.useState(uiConfigs?.fontSize);

  const [onLoad, setOnLoad] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [saveLoad, setSaveLoad] = React.useState(false);
  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation();

  const setLanguageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  const setFontHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(event.target.value);
  };

  const saveSettingToServer = async () => {
    if (success) {
      setSuccess(false);
      return;
    }

    setSaveLoad(true);
    try {
      const response = await client.post(`/setting/ui/${UserData?.id}`, {
        language: language,
        font_size: parseInt(fontSize!),
      });

      if (response.data.code === 200) {
        console.log(response.data);
        setSuccess(true);
      }
      setSaveLoad(false);
    } catch (error) {
      const errors = error as Error | AxiosError;
      if (axios.isAxiosError(errors)) {
        Promise.reject(errors.toJSON());
      } else {
        Promise.reject(Error);
      }
      setSaveLoad(false);
    }
  };

  const fetctUiSettings = async () => {
    setOnLoad(true);
    try {
      const response = await client.get(`/setting/ui/${UserData?.id}`);
      if (response.data.code == 200) {
        dispatch(
          set({
            lang: response.data.context.language,
            fontSize: response.data.context.font_size,
          })
        );
        setLanguage(response.data.context.language);
        setFontSize(response.data.context.font_size.toString());
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

  // Detect Config
  React.useEffect(() => {
    if (uiConfigs === undefined) {
      fetctUiSettings();
    }
  }, []);

  // Detect Font Change
  React.useEffect(() => {
    if (fontSize === "1") {
      dispatch(setFont("1"));
    } else if (fontSize === "1.5") {
      dispatch(setFont("1.5"));
    }
  }, [fontSize]);

  // Detect Language Change
  React.useEffect(() => {
    if (language === "en") {
      i18n.changeLanguage("en");
      dispatch(setLang("en"));
    } else if (language === "zh") {
      dispatch(setLang("zh"));
      i18n.changeLanguage("zh");
    }
  }, [language]);

  if (!onLoad) {
    return (
      <>
        <div className="m-8 bg-white p-8 rounded-xl">
          <div className="flex">
            <FormControl>
              <FormLabel id="language-buttons-group-label">
                {t("Language")}
              </FormLabel>
              <RadioGroup
                aria-labelledby="language-buttons-group-label"
                defaultValue="en"
                name="radio-buttons-group"
                onChange={setLanguageHandler}
                value={language}
              >
                <FormControlLabel
                  value="en"
                  control={<Radio />}
                  label={t("English")}
                />
                <FormControlLabel
                  value="zh"
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
                onChange={setFontHandler}
                value={fontSize}
              >
                <FormControlLabel value="1" control={<Radio />} label="1" />
                <FormControlLabel value="1.5" control={<Radio />} label="1.5" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="flex w-full items-end flex-col">
            <Fab color="primary" onClick={saveSettingToServer}>
              {success ? (
                <CheckIcon />
              ) : saveLoad ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                <SaveIcon />
              )}
            </Fab>
          </div>
        </div>
        <div className="m-8 bg-white p-8 rounded-xl">
          <Link href="#">
            <Typography style={{ color: "grey" }}>{t("FAQ")}</Typography>
          </Link>
          <Link href="#">
            <Typography style={{ color: "grey" }}>{t("DevInfo")}</Typography>
          </Link>
        </div>
      </>
    );
  } else {
    return <div className="m-8 flex bg-white p-8 rounded-xl">loading...</div>;
  }
}
