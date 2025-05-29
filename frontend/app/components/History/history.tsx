import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../app.css';
import { faCommentDots, faPlus, faEllipsisV, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../Redux/store';
import { fetchContents, setCurrentChatId, resetCurrentChatId, deleteChatById } from '../../../Redux/features/generatecontent/generatecontent';
import { fetchUserBlogs , deleteBlogChat } from '../../../Redux/features/BlogContent/blog';
import Modal from '../ui/Modal/modal';

export default function History() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { contents } = useSelector((state: RootState) => state.content);
    const blogList = useSelector((state: RootState) => state.blogContent.blogList);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const userId = localStorage.getItem('userId') || '';

    useEffect(() => {
        dispatch(fetchContents());
        if (userId) {
            dispatch(fetchUserBlogs(userId));
        }
    }, [dispatch, userId]);

    const combinedChats = [...contents, ...blogList];

    const uniqueChats = combinedChats.filter(
        (chat, index, self) =>
            index === self.findIndex((c) => (c as any)._id === (chat as any)._id)
    );

    const handleChatClick = (chatId: string) => {
        setActiveChatId(chatId);
        dispatch(setCurrentChatId(chatId));
        navigate(`/home/${chatId}`);
    };

    const handleNewChat = () => {
        dispatch(resetCurrentChatId());
        navigate(`/home/new`);
    };

    const handleDeleteChat = (chatId: string) => {
        dispatch(deleteChatById(chatId));
        dispatch(deleteBlogChat(chatId));
        setMenuOpenId(null);
    };

    return (
        <aside className="w-full md:w-64 bg-[#1a1a1a] md:p-4 py-4 h-full md:border-l border-gray-700 flex flex-col">
            <h2 className="text-xl font-bold mb-[9px] text-white flex justify-between items-center">
                Chat Bot AI
                <button
                    onClick={handleNewChat}
                    className="text-sm text-[#f86009] cursor-pointer hover:bg-[#333] px-2 py-1 rounded-[5px]"
                >
                    <FontAwesomeIcon icon={faPlus} /> New
                </button>
            </h2>

            <div className="w-full h-px bg-gray-600 my-4"></div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ul>
                    {uniqueChats.map((chat: any) => (
                        <li
                            key={chat._id}
                            className={`mb-4 p-2 rounded cursor-pointer flex items-start justify-between gap-2 text-white hover:bg-[#333]  ${activeChatId === chat._id ? "bg-[#f86009]" : ""
                                }`}
                        >
                            <div
                                className={`flex-1 flex gap-2 items-center cursor-pointer`}
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
                                <button
                                    onClick={() =>
                                        setMenuOpenId(menuOpenId === chat._id ? null : chat._id)
                                    }
                                >
                                    <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4 cursor-pointer" />
                                </button>

                                {menuOpenId === chat._id && (
                                    <div className="absolute right-0 mt-2 w-28 bg-[#2a2a2a] border border-gray-600 rounded shadow-lg z-10 cursor-pointer">
                                        <Modal
                                            title="Delete Chat"
                                            message="Are you sure you want to delete this chat?"
                                            onConfirm={() => handleDeleteChat(chat._id)}
                                            triggerLabel="Delete"
                                            icon={<FontAwesomeIcon icon={faTrash} />}
                                        />
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
