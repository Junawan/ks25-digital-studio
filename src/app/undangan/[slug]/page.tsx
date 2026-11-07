import InvitationClient from "@/modules/invitation/components/InvitationClient";
export default async function PublicInvitationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ to?: string }> }) { const [{ slug }, { to }] = await Promise.all([params, searchParams]); return <InvitationClient slug={slug} guestName={to || ""} />; }
