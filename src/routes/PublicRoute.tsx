import React from "react";
// Router
import { Outlet } from "react-router-dom";

export default function PublicRoute() {
  React.useEffect(() => {
    console.log("public route");
  }, []);
  return <Outlet />;
}
