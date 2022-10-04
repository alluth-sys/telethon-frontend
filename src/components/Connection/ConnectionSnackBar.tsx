import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
// Socket
import { SocketContext } from "@/service/Socket";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// type ConnectionSnackBarProps = {
//   severity: any;
//   text: string;
// };

export default function ConnectionSnackBar() {
  const [open, setOpen] = React.useState(true);
  const socket = React.useContext(SocketContext);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    socket.on("connect", () => {
      setOpen(true);
    });
    socket.on("disconnect", () => {
      setOpen(true);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={socket.connected ? "success" : "error"}
        sx={{ width: "100%" }}
      >
        {socket.connected ? "Connected" : "Disconnected"}
      </Alert>
    </Snackbar>
  );
}
