import { useState } from "react";
import Sidebar from "../components/Sidebar/sidebar";
import Chat from "../components/Chat/chat";
import History from "../components/History/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import NewChatPrompt from '../components/NewChat/Newchat';

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
  console.log("Current chatId from URL:", chatId);

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
