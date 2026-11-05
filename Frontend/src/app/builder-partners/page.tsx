import { fetchDevelopers } from "@/lib/api";
import DevelopersClient from "./DevelopersClient";

export default async function DevelopersPage() {
  const devsResponse = await fetchDevelopers();
  const developersData = devsResponse.data || devsResponse || [];

  return <DevelopersClient initialDevelopers={developersData} />;
}
