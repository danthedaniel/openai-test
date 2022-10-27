import { Model } from "openai";
import { ApiResponse } from "./api-types";

const API_BASE = "/api";

export const getModels = async () => {
  const response = await fetch(`${API_BASE}/models`);
  const json = (await response.json()) as ApiResponse<Model[]>;
  return json.data;
};
