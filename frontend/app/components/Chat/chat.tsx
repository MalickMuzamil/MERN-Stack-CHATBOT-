import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointUp } from "@fortawesome/free-regular-svg-icons";
import { useState, useRef } from "react";
import type { AppDispatch } from '../../../Redux/store/index';
import { useDispatch } from 'react-redux';
import { faPaperPlane, faPlus, faCode, faLightbulb, faEnvelopeOpenText, } from "@fortawesome/free-solid-svg-icons";
import { generateContent } from '../../../Redux/features/generatecontent/generatecontent'

export default function chat() {
    const [message, setMessage] = useState("");
    const [showInitialCards, setShowInitialCards] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [chatId, setChatId] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'ai'; message: string }[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);

        try {
            setChatHistory((prev) => [...prev, { type: 'user', message }]);

            const result = await dispatch(generateContent({ prompt: message, chatId })).unwrap();

            const { messages: backendMessages, _id } = result.data;

            if (_id && !chatId) setChatId(_id);
            const updatedHistory = backendMessages.map((msg: any) => ({
                type: msg.sender === "user" ? "user" : "ai",
                message: msg.content
            }));

            setChatHistory(updatedHistory);
        }

        catch (error) {
            setChatHistory((prev) => [...prev, {
                type: 'ai',
                message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
            }]);
        }

        setMessage("");
        setShowInitialCards(false);
        setLoading(false);
    };



    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    return (
        <>

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

                <div className="flex-1 overflow-auto p-4 bg-[#1a1a1a] mb-4">
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
                                    className={`p-3 rounded shadow-sm max-w-[75%] ${chat.type === 'user' ? 'bg-[#2e2e2e] text-white self-end' : 'bg-[#444] text-green-400 self-start'
                                        }`}
                                >
                                    {chat.message}
                                </div>
                            ))}
                        </div>


                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex items-center bg-[#242424] rounded overflow-hidden w-full"
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
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <input
                        type="text"
                        placeholder="Chat With AI"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className=" w-full md:w-[23px] md:flex-grow px-4 py-2 bg-[#242424] text-white placeholder-white placeholder:text-sm md:placeholder:text-base outline-none"
                    />


                    <button
                        type="submit"
                        className="px-4 text-white hover:text-[#f86009] text-xl flex-shrink-0"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </form>


            </main>


        </>
    )
}
