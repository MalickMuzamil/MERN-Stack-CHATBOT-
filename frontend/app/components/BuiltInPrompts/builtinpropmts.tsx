import React, { useState, useRef } from "react";
import Sidebar from "../Sidebar/sidebar";
import History from "../History/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus, faHandPointUp, faPenNib, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faYoutube, faGithub } from "@fortawesome/free-brands-svg-icons";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../Redux/store";
import Prompt, { setSelectedPrompt, postPrompt, postFollowUp } from '../../../Redux/features/BlogContent/blog';


export default function BuiltInPrompts() {
    const [showHistoryPanel, setShowHistoryPanel] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ type: "user" | "ai"; message: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputEnabled, setInputEnabled] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [chatId, setChatId] = useState<string | null>(null);

    const prompts = [
        { text: "Create an SEO-optimized blog post on AI trends", icon: faPenNib },
        { text: "Write a professional LinkedIn summary", icon: faLinkedin },
        { text: "Craft a catchy YouTube video title", icon: faYoutube },
        { text: "Generate an engaging YouTube video description", icon: faYoutube },
        { text: "Prepare a detailed GitHub README template", icon: faFileAlt },
        { text: "Explain GitHub workflows for beginners", icon: faGithub },
    ];


    const handlePromptClick = async (prompt: string) => {
        console.log("Selected prompt:", prompt);
        setChatHistory((prev) => [...prev, { type: "user", message: prompt }]);
        setInputEnabled(true);
        setMessage("");

        dispatch(setSelectedPrompt(prompt));
        dispatch(postPrompt(prompt));

        const response = await dispatch(postPrompt(prompt)).unwrap();

        if (response.aiMessage) {
            setChatHistory(prev => [...prev, { type: "ai", message: response.aiMessage }]);
            setChatId(response.chatId);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim() || !chatId) return;

        setLoading(true);
        setError(null);

        try {
            setChatHistory((prev) => [...prev, { type: "user", message }]);

            const response = await dispatch(
                postFollowUp({ message, chatId })
            ).unwrap();

            if (response.aiMessage) {
                setChatHistory((prev) => [...prev, { type: "ai", message: response.aiMessage }]);
                if (response.isFinal) {
                    setInputEnabled(false); // Disable input if final answer given
                }
            }
        } catch (err: any) {
            setError(err.message || "Failed to send message");
        } finally {
            setLoading(false);
            setMessage("");
        }
    };


    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <div className="hidden md:block w-64 bg-[#1a1a1a]">
                <Sidebar
                    setShowHistoryPanel={setShowHistoryPanel}
                    showHistoryPanel={showHistoryPanel}
                    isMobile={false}
                />
            </div>

            <main className="flex-1 pb-7 px-5 pt-3 bg-[#1a1a1a] flex flex-col">
                <header className="border-b text-gray-600 pb-[19px] mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white text-center mx-auto md:mx-0 md:text-left md:flex-1">
                        AI Chat
                    </h2>
                    <button className="hidden md:flex border border-gray-500 hover:bg-[#f86009] text-white text-sm px-4 py-2 rounded cursor-pointer items-center gap-3 group">
                        <FontAwesomeIcon
                            icon={faHandPointUp}
                            className="text-[#f86009] transition-colors duration-200 group-hover:text-white"
                        />
                        <span>Upgrade</span>
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 bg-[#1a1a1a] mb-4 custom-scrollbar">
                    {chatHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-6">
                            <h3 className="text-white text-2xl font-bold mb-6 text-center max-w-xl">
                                Get started instantly! Pick a prompt below and watch your chat come alive.
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
                                {prompts.map((prompt, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handlePromptClick(prompt.text)}
                                        className="cursor-pointer bg-[#333] text-white p-5 rounded-lg shadow-lg hover:bg-[#f86009] hover:text-white transform transition-colors duration-300 flex flex-col items-center justify-center gap-2 text-center font-semibold select-none"
                                        title={prompt.text}
                                    >
                                        <FontAwesomeIcon icon={prompt.icon} size="2x" />
                                        <span>{prompt.text}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {chatHistory.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded shadow-sm max-w-[75%] ${chat.type === "user"
                                        ? "bg-[#2e2e2e] text-white self-end"
                                        : "bg-[#444] text-green-400 self-start"
                                        }`}
                                >
                                    {chat.message}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <form
                    onSubmit={handleSubmit}
                    className={`flex items-center bg-[#242424] rounded overflow-hidden w-full ${!inputEnabled ? "cursor-not-allowed group" : ""
                        }`}
                    style={{ minWidth: 0 }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                console.log("Selected file:", e.target.files[0]);
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="px-4 text-white hover:text-[#f86009] text-xl cursor-pointer flex-shrink-0"
                        onClick={handleFileClick}
                        disabled={!inputEnabled || loading}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Select a prompt to start..."
                            title={!inputEnabled ? "Select a prompt to enable input" : ""}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={`w-full px-4 py-2 bg-[#242424] text-white placeholder:text-sm outline-none ${!inputEnabled
                                ? "text-gray-400 placeholder:text-gray-500 cursor-not-allowed"
                                : ""
                                }`}
                            disabled={!inputEnabled || loading}
                        />
                        {!inputEnabled && (
                            <div
                                className="absolute inset-0 bg-transparent cursor-not-allowed"
                                title="Input is disabled"
                            ></div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="px-4 text-white hover:text-[#f86009] text-xl flex-shrink-0"
                        disabled={!inputEnabled || loading}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </form>
            </main>


            <div className="hidden md:block w-64 bg-[#1a1a1a] border-l border-gray-700">
                <History />
            </div>
        </div>
    );
}
