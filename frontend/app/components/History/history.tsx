import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../app.css';
import { faCommentDots, faPlus, faEllipsisV, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../Redux/store';
import { fetchContents, fetchChatById, setCurrentChatId, resetCurrentChatId, deleteChatById } from '../../../Redux/features/generatecontent/generatecontent';

export default function History() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { contents, currentChatId } = useSelector((state: RootState) => state.content);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null); // track open menu

    useEffect(() => {
        dispatch(fetchContents());
    }, [dispatch]);

    const handleChatClick = (chatId: string) => {
        dispatch(fetchChatById(chatId));
        dispatch(setCurrentChatId(chatId));
        navigate(`/chat/${chatId}`);
    };

    const handleNewChat = () => {
        dispatch(resetCurrentChatId());
        navigate(`/chat/new`);
    };

    const handleDeleteChat = (chatId: string) => {
        console.log("Delete chat", chatId);
        dispatch(deleteChatById(chatId));
        setMenuOpenId(null);
    };

    const uniqueChats = contents.filter(
        (chat, index, self) =>
            index === self.findIndex((c) => (c as any)._id === (chat as any)._id)
    );

    return (
        <aside className="w-full md:w-64 bg-[#1a1a1a] md:p-4 py-4 h-full md:border-l border-gray-700 flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-white flex justify-between items-center">
                Chat Bot AI
                <button onClick={handleNewChat} className="text-sm text-[#f86009]">
                    <FontAwesomeIcon icon={faPlus} /> New
                </button>
            </h2>

            <div className="w-full h-px bg-gray-600 my-4"></div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ul>
                    {uniqueChats.map((chat: any) => (
                        <li
                            key={chat._id}
                            className={`mb-4 p-2 rounded cursor-pointer flex items-start justify-between gap-2 text-white ${currentChatId === chat._id
                                ? "bg-[#f86009]"
                                : "hover:bg-[#333]"
                                }`}
                        >
                            <div
                                className="flex-1 flex gap-2 items-center"
                                onClick={() => handleChatClick(chat._id)}
                            >
                                <FontAwesomeIcon icon={faCommentDots} className="w-4 h-4" />
                                <span>
                                    {chat.messages?.[0]?.content
                                        ? chat.messages[0].content.substring(0, 20) +
                                        (chat.messages[0].content.length > 20 ? "..." : "")
                                        : "Untitled Chat"}
                                </span>
                            </div>

                            <div className="relative">
                                <button onClick={() =>
                                    setMenuOpenId(menuOpenId === chat._id ? null : chat._id)
                                }>
                                    <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4 cursor-pointer" />
                                </button>

                                {menuOpenId === chat._id && (
                                    <div className="absolute right-0 mt-2 w-28 bg-[#2a2a2a] border border-gray-600 rounded shadow-lg z-10 cursor-pointer">
                                        <button
                                            onClick={() => handleDeleteChat(chat._id)}
                                            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-[#3a3a3a] flex items-center gap-2 cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
