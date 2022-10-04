import React from "react";

export default function Timeindicator({ timestamp }: any) {
  return (
    <div className="pb-3 grid">
      <div
        className="font-loader w-fit px-5 py-1"
        style={{
          justifySelf: "center",
          backgroundColor: "#CFB997",
          borderRadius: "5px",
        }}
      >
        {timestamp}
      </div>
    </div>
  );
}
