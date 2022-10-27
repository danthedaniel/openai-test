import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET,
  organization: process.env.OPEN_AI_ORG,
});
export const openai = new OpenAIApi(configuration);
