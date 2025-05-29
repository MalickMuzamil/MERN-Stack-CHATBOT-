import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus, faCode, faLightbulb, faEnvelopeOpenText, faHandPointUp } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import type { AppDispatch } from '../../../Redux/store';
import { useNavigate, useParams } from "react-router-dom";
import { generateNewChatContent } from "../../../Redux/features/generatecontent/generatecontent";
import Sidebar from '../../components/Sidebar/sidebar';
import History from '../../components/History/history';

export default function Newchat() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ type: "user" | "ai"; message: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { chatId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showHistoryPanel, setShowHistoryPanel] = useState(false);

    const showInitialCards = chatHistory.length === 0;

    useEffect(() => {
        const createNewChatIfNeeded = async () => {
            if (!chatId || chatId === "new") {
                try {
                    const resultAction = await dispatch(generateNewChatContent({ prompt: "" })).unwrap();
                    const newChat = resultAction.data;
                    navigate(`/home/${newChat._id}`);
                }

                catch (err) {
                    console.error("Failed to create new chat", err);
                }
            }
        };

        createNewChatIfNeeded();
    }, [chatId, dispatch, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) return;

        setLoading(true);
        setError(null);

        try {
            setChatHistory((prev) => [...prev, { type: "user", message }]);

            const resultAction = await dispatch(generateNewChatContent({ prompt: message })).unwrap();
            const newChat = resultAction.data;
            const aiResponse = newChat.messages?.find((m: any) => m.sender === "ai")?.content || "No response";

            setChatHistory((prev) => [...prev, { type: "ai", message: aiResponse }]);

            navigate(`/home/${newChat._id}`);
        }


        catch (err: any) {
            setError(err.message || "Failed to generate chat");
        } finally {
            setLoading(false);
            setMessage("");
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    return (

        <>
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
                            <FontAwesomeIcon icon={faHandPointUp} className="text-[#f86009] transition-colors duration-200 group-hover:text-white" />
                            <span>Upgrade</span>
                        </button>
                    </header>

                    <div className="flex-1 overflow-auto p-4 bg-[#1a1a1a] mb-4 custom-scrollbar">
                        {showInitialCards ? (
                            <div className="flex flex-col md:flex-row items-center justify-center h-full gap-4">
                                <div className="bg-[#242424] text-white p-4 rounded-xl shadow-lg w-full max-w-md flex items-center gap-3">
                                    <FontAwesomeIcon icon={faCode} className="text-blue-400 w-6 h-6" />
                                    <span>Did you know AI can write code?</span>
                                </div>
                                <div className="bg-[#242424] text-white p-4 rounded-xl shadow-lg w-full max-w-md flex items-center gap-3">
                                    <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400 w-6 h-6" />
                                    <span>Try asking for a business idea!</span>
                                </div>
                                <div className="bg-[#242424] text-white p-4 rounded-xl shadow-lg w-full max-w-md flex items-center gap-3">
                                    <FontAwesomeIcon icon={faEnvelopeOpenText} className="text-green-400 w-6 h-6" />
                                    <span>Or get help with writing emails.</span>
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

                    <form onSubmit={handleSubmit} className="flex items-center bg-[#242424] rounded overflow-hidden w-full" style={{ minWidth: 0 }}>
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
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>

                        <input
                            type="text"
                            placeholder="Chat With AI"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full md:w-[23px] md:flex-grow px-4 py-2 bg-[#242424] text-white placeholder-white placeholder:text-sm md:placeholder:text-base outline-none"
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            className="px-4 text-white hover:text-[#f86009] text-xl flex-shrink-0"
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </main>

                <div className="hidden md:block w-64 bg-[#1a1a1a] border-l border-gray-700">
                    <History />
                </div>
            </div>
        </>
    );
}
