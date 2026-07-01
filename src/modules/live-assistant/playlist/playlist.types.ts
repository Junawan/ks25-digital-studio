export interface Playlist {
  playlistId: string;

  companyId: string;

  name: string;

  description?: string;

  productIds: string[];

  sortOrder: number;

  isDefault: boolean;

  createdAt: Date;

  updatedAt: Date;
}