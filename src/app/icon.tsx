import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.767 19.089c4.924.868 6.14-6.025 2.924-9.132-1.78-1.747-5.8-2.022-6.032-4.303-.214-2.084 3.214-2.531 5.486-1.134" />
          <path d="M12.635 17.79c4.924.868 6.14-6.025 2.923-9.132-1.78-1.747-5.8-2.022-6.032-4.303-.214-2.084 3.214-2.531 5.486-1.134" />
          <path d="M9 12h4.5" />
          <path d="M9 8h4.5" />
          <path d="M9 16h4.5" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
