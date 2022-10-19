import { socket } from "@/service/Socket";
import React from "react";
// Router
import { Outlet } from "react-router-dom";

export default function PublicRoute() {
  return <Outlet />;
}
