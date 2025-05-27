import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../Redux/store';
import { fetchContents, fetchChatById } from '../../../Redux/features/generatecontent/generatecontent';

export default function History() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { contents, loading } = useSelector((state: RootState) => state.content);

    useEffect(() => {
        dispatch(fetchContents());
    }, [dispatch]);

    const handleChatClick = (chatId: string) => {
        dispatch(fetchChatById(chatId));
        navigate(`/chat/${chatId}`);
    };

    return (
        <aside className="w-full md:w-64 bg-[#1a1a1a] md:p-4 py-4 h-full md:border-l border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-white">Chat Bot AI</h2>

            <div className="w-full h-px bg-gray-600 my-4"></div>

            {loading ? (
                <p className="text-gray-400">Loading chats...</p>
            ) : (
                <ul>
                    {contents.map((chat: any) => (
                        <li
                            key={chat._id}
                            onClick={() => handleChatClick(chat._id)}
                            className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2 text-white"
                        >
                            <FontAwesomeIcon icon={faCommentDots} className="w-4 h-4" />
                            <span>
                                {chat.messages && chat.messages.length > 0
                                    ? chat.messages[0].content.substring(0, 20) + (chat.messages[0].content.length > 20 ? '...' : '')
                                    : 'Untitled Chat'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
