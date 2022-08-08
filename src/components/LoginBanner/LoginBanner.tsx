import styles from "@/components/LoginBanner/LoginBanner.module.css";
import Typography from "@mui/material/Typography";
import Spacer from "react-spacer";
import TelegramIcon from "@mui/icons-material/Telegram";

export default function LoginBanner() {
  return (
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
  );
}
