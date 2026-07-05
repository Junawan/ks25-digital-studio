import { randomUUID } from "crypto";

import { LiveSessionRepository } from "../live-session.repository";
import { Playlist } from "../../playlist/playlist.types";

export class CreateOrResumeLiveSessionUseCase {
  constructor(
    private readonly repository: LiveSessionRepository
  ) {}

  async execute(
    playlist: Playlist
  ): Promise<void> {
    await this.repository.createOrResume({
      sessionId: randomUUID(),

      companyId: playlist.companyId,

      playlistId: playlist.playlistId,

      playlistName: playlist.name,

      startedAt: new Date(),

      lastOpenedAt: new Date(),

      endedAt: null,

      totalProducts: playlist.productIds.length,

      status: "active",

      firstProductId:
    playlist.productIds[0] ?? "",

currentProductId:
    playlist.productIds[0] ?? "",
    });
  }
}