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

// Translation
import { useTranslation } from "react-i18next";

import Spacer from "react-spacer";

export default function LanguageSettings() {
  const [language, setLanguage] = React.useState("English");
  const { t, i18n } = useTranslation();

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
    <>
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
      <div className="m-8">
        <Link href="#">
          <Typography style={{ color: "grey" }}>{t("FAQ")}</Typography>
        </Link>
        <Link href="#">
          <Typography style={{ color: "grey" }}>{t("DevInfo")}</Typography>
        </Link>
      </div>
    </>
  );
}
