export type UserPhoto = {
  id: string;          // uuid (локальный id для сортировки/удаления)
  path: string;        // S3 key/path
  order: number;       // порядок
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  createdAt?: string;
};