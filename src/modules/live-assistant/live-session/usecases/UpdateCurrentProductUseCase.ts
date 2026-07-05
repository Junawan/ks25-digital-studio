import { LiveSessionRepository } from "../live-session.repository";

export class UpdateCurrentProductUseCase {

  constructor(

    private readonly repository:
    LiveSessionRepository

  ){}

  async execute(

    companyId:string,

    playlistId:string,

    productId:string

  ){

    await this.repository.updateCurrentProduct(

      companyId,

      playlistId,

      productId

    );

  }

}