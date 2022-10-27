import { NextApiRequest, NextApiResponse } from "next";
import { Model } from "openai";
import { ApiResponse } from "../../lib/api-types";
import { openai } from "../../lib/openai";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<Model[]>>
) {
  const modelResponse = await openai.listModels();
  const data = modelResponse.data.data;

  response.status(200).json({ status: "success", data });
}
