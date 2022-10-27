import { useEffect, useState } from "react";
import Layout from "../components/layouts/simple";
import { getModels } from "../lib/api";
import { Model } from "openai";

const results: string[] = [
  "The quick brown fox jumped over the lazy dog",
  "The quick brown fox jumped over the lazy dog",
  "The quick brown fox jumped over the lazy dog",
  "The quick brown fox jumped over the lazy dog",
  "The quick brown fox jumped over the lazy dog",
  "The quick brown fox jumped over the lazy dog",
  "The quick brown fox jumped over the lazy dog",
];

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    getModels().then((newModels) => {
      setModels(
        newModels
          .sort((a, b) => a.id.localeCompare(b.id))
          .filter((model) => model.id.includes("similarity"))
      );
    });
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select className="grow">
              {models.map((model) => (
                <option value={model.id}>{model.id}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="/foobar/g"
              className="grow border"
            ></input>
          </div>
          <textarea className="block border" rows={30}></textarea>
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Search..."
            className="border mb-4"
          ></input>
          {results.map((result, index) => (
            <div key={index} className="mb-4">
              {result}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
