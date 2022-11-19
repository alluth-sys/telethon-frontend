import React from "react";
import AdvanceSettings from "@/components/SettingsComponents/AdvanceSettings";
import LanguageSettings from "@/components/SettingsComponents/LanguageSettings";
import UserInfo from "@/components/SettingsComponents/UserInfo";

export default function Settings() {
  return (
    <div className="w-full flex bg-[url('./resources/bg5.png')]">
      {/* Left */}
      <div className="m-8 w-fit">
        <UserInfo />
        <LanguageSettings />
      </div>
      {/* Right */}
      <div className="m-8 w-2/5 p-8">
        <AdvanceSettings />
      </div>
    </div>
  );
}
