import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDevelopers } from "@/lib/api";
import DeveloperDetailClient from "./DeveloperDetailClient";
import { formatCityName } from "@/lib/cityUtils";

// ─── generateStaticParams ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  const res = await fetchDevelopers();
  const developersData = res.data || res || [];
  return developersData.map((d: any) => ({ slug: d.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetchDevelopers();
  const developersData = res.data || res || [];
  const dev = developersData.find((d: any) => d.slug === slug);
  if (!dev) return {};
  return {
    title: `${dev.name} | Developer Profile | A to I Infra`,
    description: `Explore ${dev.name} — ${dev.tagline}. ${dev.completedProjects || 0} completed projects, ${dev.ongoingProjects || 0} ongoing. View properties on A to I Infra.`,
  };
}

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetchDevelopers();
  const developersData = res.data || res || [];
  const dev = developersData.find((d: any) => d.slug === slug);
  if (!dev) notFound();

  const devHq = formatCityName(dev.hqCity);
  const devCities = (dev.operatingCities || dev.cities || []).map(formatCityName);

  const related = developersData
    .filter(
      (d: any) =>
        d.slug !== dev.slug &&
        (formatCityName(d.hqCity) === devHq ||
          (d.operatingCities || d.cities || []).map(formatCityName).some((c: string) => devCities.includes(c)))
    )
    .slice(0, 3);

  return <DeveloperDetailClient dev={dev} related={related} />;
}
