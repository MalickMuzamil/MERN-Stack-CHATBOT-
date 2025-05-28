import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/sidebar';
import Chat from '../../components/Chat/chat';
import History from '../../components/History/history';

export default function HistoryChat() {

  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const { id: chatId } = useParams();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="hidden md:block w-64 bg-[#1a1a1a]">
        <Sidebar
          setShowHistoryPanel={setShowHistoryPanel}
          showHistoryPanel={showHistoryPanel}
          isMobile={false}
        />
      </div>


      <div className="flex flex-col flex-1 relative">
        <Chat chatId={chatId} />
      </div>

      <div className="hidden md:block w-64 bg-[#1a1a1a] border-l border-gray-700">
        <History />
      </div>
    </div>
  );
}
