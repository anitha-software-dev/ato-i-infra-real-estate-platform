import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Residential Properties | A to I Infra",
  description: "Find your dream home with our curated list of residential properties, apartments, and villas.",
};

export default function ResidentialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
