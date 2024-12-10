"use client";
import React from "react";

interface MainProps {}

const Main: React.FC<MainProps> = () => {
  return (
    <div>
      <h1>Hello World!</h1>
      <div className="top-margin2">{/* <EmergencyNotice/> */}</div>
    </div>
  );
};

export default Main;
