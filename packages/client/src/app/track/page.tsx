"use client";
import { sendGet } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import { ApiMnt002Response } from "@depot/api/monitor";

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  useEffect(() => {
    getData();
  }, []);
  const [tracks, setTracks] = useState<ApiMnt002Response["trackData"]>([]);
  const getData = async () => {
    const res = await sendGet<ApiMnt002Response>(`/monitor/tracks`);
    setTracks(res.trackData);
  };

  return (
    <div>
      <div className="top-margin2">
        <h1>Hello World!</h1>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={cellStyle}>Tracker ID</th>
              <th style={cellStyle}>Intensity</th>
              <th style={cellStyle}>LM ID</th>
              <th style={cellStyle}>Timestamp</th>
              <th style={cellStyle}>Last</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={cellStyle}>{track.trackerId}</td>
                <td style={cellStyle}>{track.intensity}</td>
                <td style={cellStyle}>{track.lmId}</td>
                <td style={cellStyle}>{track.createdAt.toString()}</td>
                <td style={cellStyle}>{track.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "center",
  border: "1px solid #ddd",
};

export default Page;
