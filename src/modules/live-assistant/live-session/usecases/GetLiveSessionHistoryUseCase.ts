import { LiveSessionRepository } from "../live-session.repository";
import { LiveSession } from "../live-session.types";

export class GetLiveSessionHistoryUseCase {
  constructor(
    private readonly repository: LiveSessionRepository
  ) {}

  async execute(
    companyId: string
  ): Promise<LiveSession[]> {
    return this.repository.findHistoryByCompany(
      companyId
    );
  }
}