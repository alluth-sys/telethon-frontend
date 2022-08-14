import styles from "./SignIn.module.css";
import LoginForm from "@/components/LoginForm/LoginForm";
import LoginBanner from "@/components/LoginBanner/LoginBanner";

export default function SignIn() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <LoginBanner />
      </div>
      <div className={styles.right}>
        <LoginForm />
      </div>
    </div>
  );
}
