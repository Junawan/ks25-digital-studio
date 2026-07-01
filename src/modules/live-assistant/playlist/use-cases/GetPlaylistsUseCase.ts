import { PlaylistRepository } from "../playlist.repository";
import { Playlist } from "../playlist.types";

export class GetPlaylistsUseCase {

  constructor(
    private readonly repository:
      PlaylistRepository
  ) {}

  async execute(
    companyId: string
  ): Promise<Playlist[]> {

    return this.repository.findByCompanyId(
      companyId
    );

  }

}