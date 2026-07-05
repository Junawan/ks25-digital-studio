import { AddProductToPlaylistUseCase } from "../playlist/use-cases/AddProductToPlaylistUseCase";
import { CreatePlaylistUseCase } from "../playlist/use-cases/CreatePlaylistUseCase";
import { DeletePlaylistUseCase } from "../playlist/use-cases/DeletePlaylistUseCase";
import { GetPlaylistByIdUseCase } from "../playlist/use-cases/GetPlaylistByIdUseCase";
import { GetPlaylistsUseCase } from "../playlist/use-cases/GetPlaylistsUseCase";
import { GetPlaylistUseCase } from "../playlist/use-cases/GetPlaylistUseCase";
import { UpdatePlaylistUseCase } from "../playlist/use-cases/UpdatePlaylistUseCase";
import { productRepository } from "../product/product.repository";
import { CreateProductUseCase } from "../product/use-cases/CreateProductUseCase";
import { DeleteProductUseCase } from "../product/use-cases/DeleteProductUseCase";
import { GetProductsByIdsUseCase } from "../product/use-cases/GetProductsByIdsUseCase";
import { GetProductsUseCase } from "../product/use-cases/GetProductsUseCase";
import { ImportProductsUseCase } from "../product/use-cases/ImportProductsUseCase";
import { UpdateProductUseCase } from "../product/use-cases/UpdateProductUseCase";
import { playlistRepository } from "./repositories";
import { RemoveProductFromPlaylistUseCase } from "../playlist/use-cases/RemoveProductFromPlaylistUseCase";
import { UpdatePlaylistOrderUseCase } from "../playlist/use-cases/UpdatePlaylistOrderUseCase";


  export const createProductUseCase =
  new CreateProductUseCase(
    productRepository
  );

export const getProductsUseCase =
  new GetProductsUseCase(
    productRepository
  );

  export const updateProductUseCase =
  new UpdateProductUseCase(
    productRepository
  );

  export const deleteProductUseCase =
  new DeleteProductUseCase(
    productRepository
    
  );

  export const importProductsUseCase =
    new ImportProductsUseCase(
        productRepository
    );


  export const getProductsByIdsUseCase =
  new GetProductsByIdsUseCase(
    productRepository
  );

  export const getPlaylistsUseCase =
  new GetPlaylistsUseCase(
    playlistRepository
  );

export const createPlaylistUseCase =
  new CreatePlaylistUseCase(
    playlistRepository
  );

export const updatePlaylistUseCase =
  new UpdatePlaylistUseCase(
    playlistRepository
  );

export const deletePlaylistUseCase =
  new DeletePlaylistUseCase(
    playlistRepository
  );

  export const getPlaylistUseCase =
  new GetPlaylistUseCase(
    playlistRepository
  );

  export const addProductToPlaylistUseCase =
  new AddProductToPlaylistUseCase(
    playlistRepository
  );

  export const getPlaylistByIdUseCase =
  new GetPlaylistByIdUseCase(
    playlistRepository
  );

  export const removeProductFromPlaylistUseCase =
  new RemoveProductFromPlaylistUseCase(
    playlistRepository
  );

  export const updatePlaylistOrderUseCase =
  new UpdatePlaylistOrderUseCase(
    playlistRepository
  );