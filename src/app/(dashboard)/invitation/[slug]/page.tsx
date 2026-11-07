import DashboardInvitationDetail from "@/modules/invitation/components/dashboard/DashboardInvitationDetail";
export default async function InvitationDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <DashboardInvitationDetail slug={slug} />; }
