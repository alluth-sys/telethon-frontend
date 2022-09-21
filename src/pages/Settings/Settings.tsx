import React from "react";

import AdvanceSettings from "@/components/SettingsComponents/AdvanceSettings";
import LanguageSettings from "@/components/SettingsComponents/LanguageSettings";
import UserInfo from "@/components/SettingsComponents/UserInfo";

export default function Settings() {
  return (
    <div className="w-full flex">
      {/* Left */}
      <div className="m-8 w-2/4">
        <UserInfo />
        <LanguageSettings />
      </div>
      {/* Right */}
      <div className="m-8 w-2/4">
        <AdvanceSettings />
      </div>
    </div>
  );
}
