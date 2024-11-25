// pages/index.js

import React from "react";

const Home = () => {
  return (
    <div>
      <h1>NEXT_PUBLIC_API_URL 출력</h1>
      <p>{process.env.NEXT_PUBLIC_API_URL}</p>
    </div>
  );
};

export default Home;
