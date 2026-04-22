import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trợ lý Chọn Trường Thông Minh",
  description: "Trợ lý Chọn Trường Thông Minh",
};

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 min-h-0">{children}</div>;
}
