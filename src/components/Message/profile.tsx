import { Typography } from "@material-ui/core";

export default function profile({ b64, name }) {
  return (
    <>
      <img
        src={`data:image/jpeg;base64,${b64["b64"]}`}
        className="w-15 h-15 rounded-full"
      />
      <Typography>name</Typography>
    </>
  );
}
