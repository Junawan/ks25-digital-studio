import CreateInvitationForm from "@/modules/invitation/components/CreateInvitationForm";
export default async function CreateInvitationPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const { theme } = await searchParams;
  return <CreateInvitationForm initialTheme={theme} />;
}
