import { useEffect, useState } from "react";
import Layout from "../components/layouts/simple";
import { getEmbeddings, getModels } from "../lib/api";
import { CreateEmbeddingResponseDataInner, Model } from "openai";

interface Result extends CreateEmbeddingResponseDataInner {
  similarity: number;
  text: string;
}

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  // Form
  const [formModel, setFormModel] = useState<string>("");
  const [formRegex, setFormRegex] = useState<string>("/^.*$/gm");
  const [formCorpus, setFormCorpus] = useState<string>("");
  const [formSearch, setFormSearch] = useState<string>("");

  useEffect(() => {
    getModels().then((newModels) => {
      const filteredModels = newModels
        .sort((a, b) => a.id.localeCompare(b.id))
        .filter(
          (model) =>
            model.id.includes("similarity") || model.id.includes("search")
        );
      setModels(filteredModels);
      setFormModel(filteredModels[0].id);
    });
  }, []);

  const similarity = (embedding_a: number[], embedding_b: number[]): number => {
    if (embedding_a.length !== embedding_b.length) {
      throw new Error("Embeddings do not have the same length");
    }

    let result = 0;

    for (let i = 0; i < embedding_a.length; i++) {
      result += embedding_a[i] * embedding_b[i];
    }

    return result;
  };

  const parseRegex = () => {
    try {
      const regex = eval(formRegex);
      if (regex.constructor == RegExp) {
        return regex;
      }

      return null;
    } catch (e) {
      return null;
    }
  };

  const doSearch = async () => {
    const regex = parseRegex();
    if (!regex) return;

    const corpusChunks = Array.from(formCorpus.matchAll(regex))
      .map((result) => result[0])
      .filter((chunk) => chunk.trim().length > 0);
    if (!corpusChunks) return;

    const input = [...corpusChunks, formSearch];
    const embeddings = await getEmbeddings({
      model: formModel,
      input,
    });

    const data = embeddings.data.sort((a, b) => a.index - b.index);
    const queryEmbedding = data.pop();
    if (!queryEmbedding) return;

    const results = data
      .map((datum) => ({
        similarity: similarity(datum.embedding, queryEmbedding.embedding),
        text: input[datum.index],
        ...datum,
      }))
      .sort((a, b) => b.similarity - a.similarity);
    setResults(results);
  };

  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={formModel}
              onChange={(event) => setFormModel(event.target.value)}
              className="grow"
            >
              {models.map((model) => (
                <option value={model.id}>{model.id}</option>
              ))}
            </select>
            <input
              type="text"
              value={formRegex}
              onChange={(event) => setFormRegex(event.target.value)}
              className="grow border"
            ></input>
          </div>
          <textarea
            value={formCorpus}
            onChange={(event) => setFormCorpus(event.target.value)}
            className="block border"
            placeholder="Paste multiple lines of text here. Will be broken up by line breaks by default."
            rows={30}
          ></textarea>
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            value={formSearch}
            onChange={(event) => setFormSearch(event.target.value)}
            onKeyDown={(event) => event.key == "Enter" && doSearch()}
            placeholder="Search query..."
            className="border mb-4"
          ></input>
          {results.map((result) => (
            <div key={result.text} className="mb-4">
              ({result.similarity.toFixed(3)}) {result.text}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
