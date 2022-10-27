import { NextApiRequest, NextApiResponse } from "next";
import { CreateEmbeddingResponse } from "openai";
import { ApiResponse, EmbeddingsParams } from "../../lib/api-types";
import { openai } from "../../lib/openai";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<CreateEmbeddingResponse>>
) {
  const { model, input } = JSON.parse(request.body) as EmbeddingsParams;
  const embeddingResponse = await openai.createEmbedding({
    model,
    input,
  });
  const data = embeddingResponse.data;

  response.status(200).json({ status: "success", data });
}
