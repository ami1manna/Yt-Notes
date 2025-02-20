import { useState } from "react";
import ReactMarkdown from "react-markdown"; // Import Markdown Renderer
import { Send, Loader } from "lucide-react";

const models = [
  { name: "GPT-4o", value: "gpt-4o" },
  { name: "Claude 3.5 Sonnet", value: "claude-sonnet-3.5" },
  { name: "Gemini 1.5", value: "gemini-1.5" },
  { name: "DeepSeek Chat", value: "deepseek-chat" },
];

export default function AIChat() {
  const [model, setModel] = useState(models[0].value);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const updatedMessages = [...messages, { role: "user", text: input }];
    setMessages(updatedMessages);

    setInput("");
    try {
      const resp = await puter.ai.chat(input, {
        model,
        stream: true,
        history: updatedMessages,
      });

      let botResponse = "";
      setMessages((prev) => [...prev, { role: "bot", text: "..." }]);

      for await (const part of resp) {
        botResponse += part?.text || "";
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 && msg.role === "bot"
              ? { ...msg, text: botResponse }
              : msg
          )
        );
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Error fetching response." }]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-extrabold text-orange-500 mb-6">AI Chat</h1>
      <select
        className="mb-4 p-3 bg-gray-800 text-orange-400 border border-orange-500 rounded-md shadow-md focus:ring focus:ring-orange-400"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        {models.map((m) => (
          <option key={m.value} value={m.value}>{m.name}</option>
        ))}
      </select>
      <div className="w-full max-w-lg h-96 overflow-y-auto bg-gray-800 p-4 rounded-lg border border-orange-500 shadow-lg space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit max-w-[85%] ${
              msg.role === "user" ? "bg-orange-600 text-white ml-auto" : "bg-gray-700 text-orange-300"
            }`}
          >
            {/* Render Markdown Messages */}
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {loading && <p className="text-orange-400 flex items-center"><Loader className="animate-spin mr-2" size={16} /> Typing...</p>}
      </div>
      <div className="flex w-full max-w-lg mt-4">
        <input
          type="text"
          className="flex-1 p-3 bg-gray-800 text-white border border-orange-500 rounded-l-md focus:ring focus:ring-orange-400 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="p-3 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 transition flex items-center justify-center"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
