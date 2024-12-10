import "./globals.css";
import { ReactNode } from "react";
import "react-datepicker/dist/react-datepicker.css";
export const metadata = {
  generateViewport: {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="shortcut icon" href="/img/Favicon.svg" />
      </head>
      <body>
        <div style={{ padding: "20px", margin: "100px" }}>
          {children} {/* children이 여기에 렌더링됩니다 */}
        </div>
      </body>
    </html>
  );
}
