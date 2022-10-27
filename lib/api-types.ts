export type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export interface EmbeddingsParams {
  model: string;
  input: string[];
}
