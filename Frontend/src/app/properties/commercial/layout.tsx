import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Properties | A to I Infra",
  description: "High-yield commercial properties, office spaces, and retail shops for smart investors.",
};

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
