"use client";

import { useState } from "react";
import { SocialIcon } from "react-social-icons";

const SOCIAL_LINKS = [
  { url: "https://www.linkedin.com/in/luoyaqi", label: "LinkedIn" },
  { url: "https://github.com/YAQIL04", label: "GitHub" },
  { url: "mailto:heather.luoyq@gmail.com", label: "Email" },
];

const WECHAT_ID = "Yk0304LLL";

export default function CreatorLinks() {
  const [copied, setCopied] = useState(false);

  const copyWechat = () => {
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map(({ url, label }) => (
        <SocialIcon
          key={label}
          url={url}
          target="_blank"
          rel="noopener noreferrer"
          bgColor="transparent"
          fgColor="rgba(255,255,255,0.35)"
          style={{ width: 32, height: 32 }}
          className="hover:opacity-80 transition-opacity"
        />
      ))}

      {/* WeChat — copy to clipboard */}
      <button
        onClick={copyWechat}
        title={copied ? "已复制 / Copied!" : `微信 ${WECHAT_ID}`}
        className="relative w-8 h-8 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
      >
        {/* WeChat SVG icon */}
        <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)" width="20" height="20">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.113a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.161 1.67-1.organised.18-2.894 3.963-2.253 6.286.63 2.33 3.043 3.902 5.498 3.758 1.133-.077 2.148-.44 3.03-1.02a.836.836 0 0 1 .68-.094l1.49.87a.29.29 0 0 0 .153.049.272.272 0 0 0 .27-.271c0-.063-.026-.126-.044-.189l-.36-1.37a.535.535 0 0 1 .196-.613c1.618-1.157 2.643-2.888 2.643-4.812-.001-3.164-2.987-5.512-6.142-5.264zm-2.678 3.15c.571 0 1.035.47 1.035 1.049 0 .578-.464 1.05-1.035 1.05s-1.036-.472-1.036-1.05c0-.579.465-1.05 1.036-1.05zm5.307 0c.572 0 1.036.47 1.036 1.049 0 .578-.464 1.05-1.036 1.05-.571 0-1.035-.472-1.035-1.05 0-.579.464-1.05 1.035-1.05z" />
        </svg>

        {/* Copied tooltip */}
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 border border-white/15 text-white/80 text-[11px] px-2 py-1 rounded-md whitespace-nowrap">
            已复制 ✓
          </span>
        )}
      </button>
    </div>
  );
}
