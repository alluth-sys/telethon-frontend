import styles from "./SignIn.module.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Spacer from "react-spacer";

// Icons
import PhoneIcon from "@mui/icons-material/Phone";
import GppGoodIcon from "@mui/icons-material/GppGood";
import TelegramIcon from "@mui/icons-material/Telegram";

// Router
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <div className={styles.logo}>
            <Typography variant="h2">Telethon</Typography>
            <Spacer width={"10px"} />
            <TelegramIcon style={{ fontSize: 60 }} />
          </div>
          <Typography variant="subtitle1" style={{ color: "gray" }}>
            Chatting experience reinovated
          </Typography>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles["input-form"]}>
          <TextField
            label="Phone Number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
          <Spacer height={"5%"} />
          <Button variant="contained" style={{ width: "60%" }} disabled>
            Send Code
          </Button>
          <Spacer height={"25%"} />
          <TextField
            label="Code"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GppGoodIcon />
                </InputAdornment>
              ),
            }}
          />
          <Spacer height={"5%"} />
          <Button
            variant="contained"
            style={{ width: "60%" }}
            onClick={() => {
              navigate("/home", { replace: true });
            }}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
