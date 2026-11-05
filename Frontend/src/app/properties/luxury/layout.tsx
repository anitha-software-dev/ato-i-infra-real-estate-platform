import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Properties | A to I Infra",
  description: "Ultra-premium residences and penthouses for those who seek the extraordinary.",
};

export default function LuxuryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
