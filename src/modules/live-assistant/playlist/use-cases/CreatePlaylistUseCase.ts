import { PlaylistRepository } from "../playlist.repository";
import { Playlist } from "../playlist.types";


export class CreatePlaylistUseCase {

  constructor(
    private readonly repository:
      PlaylistRepository
  ) {}

  async execute(
    playlist: Playlist
  ) {

    await this.repository.create(
      playlist
    );

  }

}