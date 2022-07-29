import React from "react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Button } from "@mui/material";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home() {
  const ws = useAppSelector((state: RootState) => state.socket.websocket);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (ws) {
      setOpen(true);
    }
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="w-full">
      <div>home</div>
      <Button
        onClick={() => {
          ws?.emit("test");
        }}
      >
        test
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Connected
        </Alert>
      </Snackbar>
    </div>
  );
}
