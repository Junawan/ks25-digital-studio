import { PlaylistRepository } from "../playlist.repository";
import { Playlist } from "../playlist.types";

export class UpdatePlaylistUseCase {

  constructor(
    private readonly repository:
      PlaylistRepository
  ) {}

  async execute(
    playlistId: string,
    data: Partial<Playlist>
  ) {

    await this.repository.update(
      playlistId,
      data
    );

  }

}