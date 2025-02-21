import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, Loader2, Trash } from "lucide-react";

const modelCategories = {
    "General AI": ["gpt-4o-mini", "gpt-4o", "o3-mini", "claude-3-5-sonnet"],
    "Reasoning & Knowledge": ["deepseek-chat", "deepseek-reasoner", "mistral-large-latest"],
    "Code Generation": ["codestral-latest"],
    "Open Source": ["google/gemma-2-27b-it", "grok-beta"]
};

const allModels = Object.values(modelCategories).flat();

export default function AIChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(allModels[0]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        setMessages(savedMessages);
    }, []);

    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const addMessage = (msg, isUser) => {
        setMessages((prev) => [...prev, isUser ? { content: msg, role: "user" } : { content: msg, role: "assistant" }]);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        addMessage(input, true);
        setInput("");
        setLoading(true);

        try {
            const response = await puter.ai.chat([...messages, { content: input, role: "user" }], { model: selectedModel});
            const result = selectedModel === "claude-3-5-sonnet" ? response.message.content[0].text : response.message.content;
            addMessage(result, false);
        } catch (error) {
            addMessage("Error: " + error.message + "\n", false);
            console.error("AI response error:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Are you sure you want to clear the chat history?")) {
            setMessages([]);
            localStorage.removeItem("chatMessages");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] border border-gray-100">
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-white">AI Chat Assistant</h1>
                        <div className="flex items-center gap-3">
                            <select 
                                className="px-3 py-2 rounded-lg text-sm bg-white/90 border-0 focus:ring-2 focus:ring-white/20"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            >
                                {Object.entries(modelCategories).map(([category, models]) => (
                                    <optgroup key={category} label={category}>
                                        {models.map((model) => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <button
                                onClick={clearChat}
                                className="px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Trash size={16} /> Clear Chat
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                msg.role === "user" ? "bg-blue-500" : "bg-purple-500"
                            }`}>
                                {msg.role === "user" ? (
                                    <User size={18} className="text-white" />
                                ) : (
                                    <Bot size={18} className="text-white" />
                                )}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] ${
                                msg.role === "user" 
                                    ? "bg-blue-500 text-white" 
                                    : "bg-gray-100"
                            }`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                <Loader2 size={18} className="text-white animate-spin" />
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-100 shadow-sm">
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white"
                            placeholder="Type your message here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        />
                        <button
                            className={`p-4 rounded-xl ${
                                input.trim() 
                                    ? "bg-blue-500 hover:bg-blue-600" 
                                    : "bg-gray-300"
                            } text-white transition-colors`}
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Created using Puter.JS</p>
        </div>
    );
}