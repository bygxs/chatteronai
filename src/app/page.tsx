"use client";

import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, `You: ${input}`]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, `Bot: ${data.reply}`]);

      setInput("");
    }
  };

  return (
    <main className="flex flex-col h-screen p-4 bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="flex-grow overflow-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700"
          >
            {msg}
          </div>
        ))}
      </div>
      <div className="mb-10">
        {" "}
        {/* Added container with bottom margin */}
        <form onSubmit={sendMessage} className="flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-l bg-white dark:bg-gray-600 text-black dark:text-white resize-none"
            rows={2} // Allows for two lines of text
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
