import { PlaylistRepository } from "../playlist.repository";
import { Playlist } from "../playlist.types";

export class GetPlaylistUseCase {
  constructor(
    private readonly repository: PlaylistRepository
  ) {}

  async execute(
    playlistId: string
  ): Promise<Playlist | null> {
    return this.repository.findById(
      playlistId
    );
  }
}