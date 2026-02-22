"use client";

import { useState } from "react";
import "./other.css";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  interface Prediction { country: string; confidence: number; }
  const [top5, setTop5] = useState<Prediction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setTop5([]);          
    setError(null);       
  }

  
  async function predict() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setTop5([]);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("http://localhost:8000/predict", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.status === "error") setError(data.message);
      else setTop5(data.top5);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ padding: 30 }}>
      <h1 className="main-text">Geo Classifier</h1>

      <label className="custom-file-label">
        Upload Street View Image
        <input className="file-input-hidden" type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <div className="image-box">
      {preview && (
        <div style={{ marginTop: 20 }}>
          <img className="image-preview" src={preview} style={{ maxWidth: 400, maxHeight: 400 }} />
        </div>
      )}
      </div>

      <button className="button"
        onClick={predict}
        disabled={!file}
        style={{ marginTop: 20 }}
      >
        Predict Country
      </button>

      
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {top5.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2>Top predictions</h2>
          <ol>
            {top5.map((p, i) => (
              <li key={i}>
                <strong>{p.country}</strong> — {(p.confidence * 100).toFixed(1)}%
              </li>
            ))}
          </ol>
        </div>
      )}
    </main>
  );
}