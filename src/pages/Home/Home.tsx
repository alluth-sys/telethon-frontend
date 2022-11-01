import React from "react";

import ContactList from "./Components/ContactList";
import BubbleSettings from "./Components/BubbleSettings";
import BubblePanel from "./BubblePanel";

export default function Home() {
  return (
    <div className="w-full relative">
      <div className="bg-[url('./resources/bg5.png')] w-full h-full">
        <BubblePanel />
        <ContactList />
        <BubbleSettings />
      </div>
    </div>
  );
}
