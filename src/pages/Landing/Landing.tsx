import styles from "./Landing.module.css";
import { useSpring, animated } from "react-spring";

import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Spacer from "react-spacer";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const animationTextStyles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
    config: { duration: 2000 },
  });

  const animationButtonStyles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
    config: { duration: 500 },
    delay: 2000,
  });

  return (
    <div className={styles.container}>
      <animated.div className={styles.message} style={animationTextStyles}>
        Welcome
      </animated.div>
      <Spacer height={"5%"} />
      <animated.div style={animationButtonStyles}>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => {
            navigate("/signin");
          }}
        >
          Get Started
        </Button>
      </animated.div>
    </div>
  );
}

export default Landing;
