import { fetchEvents } from "@/lib/api";
import EventsClient from "./EventsClient";

export default async function EventsPage() {
  const eventsResponse = await fetchEvents();
  const eventsData = eventsResponse.data || eventsResponse || [];

  return <EventsClient initialEvents={eventsData} />;
}
