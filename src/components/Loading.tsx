import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <CircularProgress />
    </div>
  );
}
