import React from "react";
import ContactList from "./Components/ContactList";

import BubblePanel from "./BubblePanel";

export default function Home() {
  return (
    <div className="w-full relative">
      <div className="bg-[url('./resources/bg.png')] w-full h-full">
        <BubblePanel />
        <ContactList />
      </div>
    </div>
  );
}
