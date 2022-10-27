import { CreateEmbeddingResponse, Model } from "openai";
import { ApiResponse, EmbeddingsParams } from "./api-types";

const API_BASE = "/api";

export const getModels = async () => {
  const response = await fetch(`${API_BASE}/models`);
  const json = (await response.json()) as ApiResponse<Model[]>;

  if (json.status == "success") {
    return json.data;
  }

  throw new Error(json.message);
};

export const getEmbeddings = async (params: EmbeddingsParams) => {
  const response = await fetch(`${API_BASE}/embeddings`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  const json = (await response.json()) as ApiResponse<CreateEmbeddingResponse>;

  if (json.status == "success") {
    return json.data;
  }

  throw new Error(json.message);
};
