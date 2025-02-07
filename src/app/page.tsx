'use client'

import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

interface Message {
  id: string;
  content: string;
  timestamp: any;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await addDoc(collection(db, "messages"), {
        content: input,
        timestamp: serverTimestamp(),
      });
      setInput("");
    }
  };

  return (
    <main className="flex flex-col h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div key={msg.id} className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <p className="break-words">{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <label htmlFor="messageInput" className="sr-only">Type a message</label>
        <input
          id="messageInput"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder="Type your message..."
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </main>
  );
}
