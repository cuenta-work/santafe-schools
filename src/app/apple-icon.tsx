import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width={180} height={180} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="#1E4FA3" />
        <path d="M20 10.5 L33 15.5 L20 20.5 L7 15.5 Z" fill="#FFFFFF" />
        <path
          d="M13 17.6 V24 c0 1.8 3.1 3.4 7 3.4 s7 -1.6 7 -3.4 v-6.4"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M33 15.5 V23" stroke="#CF9C34" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="33" cy="25.3" r="1.7" fill="#CF9C34" />
      </svg>
    ),
    size
  );
}
