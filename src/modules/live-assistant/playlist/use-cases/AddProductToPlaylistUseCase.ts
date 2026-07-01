import { PlaylistRepository } from "../playlist.repository";


export class AddProductToPlaylistUseCase {

  constructor(
    private readonly repository: PlaylistRepository
  ) {}

  async execute(
    playlistId: string,
    productId: string
  ) {

    await this.repository.addProduct(
      playlistId,
      productId
    );

  }

}