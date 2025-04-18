"use client"
import Login from "./login";
import { auth } from "./firebase";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Must sign in to send a message.");
      return;
    }
    currentUser.getIdToken().then((bearerToken) => {
      // make api call to openjustice.ca/api/llm/query_ex with bearer token
      fetch("https://openjustice.ai/api/llm/query_ex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          "query": query,
          "namespace": "constructive_dismissal",
          "indexName": "legal-pdf-documents",
          "fullConversation": [
          {
          "role": "user",
          "content": query
          },
          {
          "role": "assistant",
          "content": ""
          }
          ],
          "includedDocuments": [],
          "dialogFlow": "Constructive Dismissal_copy"
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      }).then((data) => {
        console.log("Response data:", data);
        setResult(data);
      })
    })
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <Login />
      {!result ? (
        <><textarea
          className="w-full h-40 p-2 border border-gray-300 rounded"
          placeholder="Type your message here..."
          value={query}
          onChange={handleChange} />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button></>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center">
          {result}
        </div>
      )}
    </div>
  );
}