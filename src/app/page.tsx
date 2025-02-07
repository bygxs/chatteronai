"use client"; // This directive tells Next.js that this is a client-side component

import { useState, KeyboardEvent } from "react";

export default function Chat() {
  // State hooks to manage messages and input
  const [messages, setMessages] = useState<string[]>([]); // Array to store chat messages
  const [input, setInput] = useState(""); // String to store current input

  // Function to send a message
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent form submission if event is provided
    if (input.trim()) { // Check if input is not empty
      // Add user message to chat
      setMessages((prev) => [...prev, `You: ${input}`]);

      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      // Get and add bot response to chat
      const data = await response.json();
      setMessages((prev) => [...prev, `Bot: ${data.reply}`]);

      // Clear input field
      setInput("");
    }
  };

  // Function to handle key presses in the textarea
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // If Enter is pressed without Shift, send the message
      e.preventDefault(); // Prevent new line in textarea
      sendMessage(); // Call sendMessage without event
    }
  };

  return (
    <main className="flex flex-col h-screen p-4 bg-white dark:bg-gray-800 text-black dark:text-white">
      {/* Chat messages display area */}
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
      {/* Input area */}
      <div className="mb-10">
        <form onSubmit={sendMessage} className="flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)} // Update input state on change
            onKeyPress={handleKeyPress} // Handle key presses
            className="flex-grow p-2 border rounded-l bg-white dark:bg-gray-600 text-black dark:text-white resize-none"
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
