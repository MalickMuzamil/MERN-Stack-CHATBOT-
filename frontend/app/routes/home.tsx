import Sidebar from "./../components/Sidebar/sidebar";
import Chat from "./../components/Chat/chat";
import History from "./../components/History/history";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  return (
    <div className="flex h-screen bg-gray-100 relative">
      <Sidebar setShowHistoryPanel={setShowHistoryPanel} />

      <Chat />

      <div className="hidden md:block">
        <History />
      </div>

      {showHistoryPanel && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowHistoryPanel(false)}
          ></div>

          <aside
            className={`fixed right-0 top-0 w-64 h-full bg-[#1a1a1a] p-4 shadow-lg overflow-auto z-50 transform transition-all duration-300 ease-in-out ${showHistoryPanel ? "translate-x-0 scale-100" : "translate-x-full scale-90"}`}
          >
            <button
              className="text-white mb-1 md:hidden z-50 bg-gray-800 text-white p-2 rounded"
              onClick={() => setShowHistoryPanel(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <History />
          </aside>

        </div>
      )}
    </div>
  );
}
