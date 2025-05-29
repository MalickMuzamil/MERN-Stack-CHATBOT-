import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/sidebar";
import Chat from "../components/Chat/chat";
import History from "../components/History/history";
import { useParams } from "react-router-dom";
import NewChatPrompt from '../components/NewChat/Newchat';
import { useDispatch } from 'react-redux';
import { fetchContents } from '../../Redux/features/generatecontent/generatecontent';
import { fetchUserBlogs } from '../../Redux/features/BlogContent/blog';
import type { AppDispatch } from "Redux/store";

export function meta() {
  return [
    { title: "ECHOAI" },
    { name: "description", content: "Welcome to EchoAI!" },
  ];
}

export default function Home() {
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id: chatId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    dispatch(fetchContents());
    if (userId) dispatch(fetchUserBlogs(userId));
  }, [dispatch, userId]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="hidden md:block w-64">
        <Sidebar
          setShowHistoryPanel={setShowHistoryPanel}
          showHistoryPanel={showHistoryPanel}
          isMobile={false}
        />
      </div>

      <div className="flex flex-col flex-1 relative">

        {chatId === 'new' ? (
          <NewChatPrompt />
        ) : (
          <Chat chatId={chatId} />
        )}
      </div>

      <div className="hidden md:block w-64 bg-[#1a1a1a] border-l border-gray-700">
        <History />
      </div>

      <div className="md:hidden">
        <Sidebar
          setShowHistoryPanel={setShowHistoryPanel}
          showHistoryPanel={showHistoryPanel}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={true}
        />
      </div>
    </div>
  );
}
