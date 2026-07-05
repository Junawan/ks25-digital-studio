import { PlaylistRepository } from "../playlist.repository";

export class UpdatePlaylistOrderUseCase {
  constructor(
    private readonly playlistRepository: PlaylistRepository
  ) {}

  async execute(
    playlistId: string,
    productIds: string[]
  ): Promise<void> {
    await this.playlistRepository.updateProductOrder(
      playlistId,
      productIds
    );
  }
}