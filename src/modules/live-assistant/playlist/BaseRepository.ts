export abstract class BaseRepository<T> {
  abstract create(data: T): Promise<void>;

  abstract update(
    id: string,
    data: Partial<T>
  ): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract findById(id: string): Promise<T | null>;

  abstract findAll(): Promise<T[]>;
}