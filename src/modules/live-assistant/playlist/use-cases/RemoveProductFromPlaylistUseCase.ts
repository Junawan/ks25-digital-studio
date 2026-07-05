import { PlaylistRepository } from "../playlist.repository";

export class RemoveProductFromPlaylistUseCase {
  constructor(
    private readonly playlistRepository: PlaylistRepository
  ) {}

  async execute(
    playlistId: string,
    productId: string
  ): Promise<void> {
    await this.playlistRepository.removeProduct(
      playlistId,
      productId
    );
  }
}