import { PlaylistRepository } from "../playlist.repository";


export class DeletePlaylistUseCase {

  constructor(
    private readonly repository:
      PlaylistRepository
  ) {}

  async execute(
    playlistId: string
  ) {

    await this.repository.delete(
      playlistId
    );

  }

}