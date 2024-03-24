"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const Landingpage = () => {
  const { data: session } = useSession();
  const [resume, setResume] = useState(null);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    try {
      debugger;
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("openai_api_key", openaiApiKey);

      const response = await fetch("http://localhost:5000/analyze_summary", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError("An error occurred while analyzing the summary");
      }
    } catch (error) {
      setError("An error occurred while uploading the resume");
    }
  };

  return (
    <div>
      <h1>Analyze Summary</h1>
      <input type="file" onChange={(e) => setResume(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter OpenAI API Key"
        value={openaiApiKey}
        onChange={(e) => setOpenaiApiKey(e.target.value)}
      />
      <button onClick={handleUpload}>Analyze Summary</button>

      {summary && (
        <div>
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Landingpage;
