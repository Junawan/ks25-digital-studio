export interface InvitationTheme {

  id: string;

  slug: string;

  name: string;

  description: string;

  image: string;

  badge: string;

  category: string;

  status: "active" | "coming-soon";

  demo: string;

  premium: boolean;
  

}