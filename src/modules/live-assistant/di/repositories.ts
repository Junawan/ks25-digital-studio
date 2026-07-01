import { PlaylistRepository } from "../playlist/playlist.repository";
import { ProductRepository } from "../product/product.repository";

export const productRepository =
  new ProductRepository();

  export const playlistRepository =
  new PlaylistRepository();
