import EditInvitationForm from "@/modules/invitation/components/EditInvitationForm";
export default async function EditInvitationPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <EditInvitationForm slug={slug} />; }
