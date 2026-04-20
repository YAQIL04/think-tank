import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人智囊团 | Think Tank",
  description: "随时召唤世界顶级思想家，以他们的心智模型为你答疑解惑。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#f0f0f5]">
        {children}
      </body>
    </html>
  );
}
