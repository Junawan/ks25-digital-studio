export interface LiveSession {
  sessionId: string;

  companyId: string;

  playlistId: string;

  playlistName: string;

  startedAt: Date;

  lastOpenedAt: Date;

  endedAt: Date | null;

  totalProducts: number;

  status: "active" | "finished";

  firstProductId: string;

  currentProductId: string;
}