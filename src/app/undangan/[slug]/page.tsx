import InvitationClient from "@/modules/invitation/components/InvitationClient";
import { demoInvitations } from "@/modules/invitation/data/demoInvitations";

export default async function PublicInvitationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ to?: string }> }) {
  const [{ slug }, { to }] = await Promise.all([params, searchParams]);
  const demoData = demoInvitations[slug];
  return <InvitationClient slug={slug} guestName={to || (demoData ? "Sahabat & Keluarga" : "")} demoData={demoData} />;
}
