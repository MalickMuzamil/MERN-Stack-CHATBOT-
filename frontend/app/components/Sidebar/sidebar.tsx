import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faRightFromBracket, faHouse, faComments, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
    setShowHistoryPanel: (value: boolean) => void;
  }

export default function sidebar({ setShowHistoryPanel }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
     const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.clear();

    navigate("/");
  };

    return (
        <>
            <div className="flex h-screen">
                <button
                    className={`md:hidden fixed top-3 z-50 bg-gray-800 text-white p-2 rounded ${isOpen ? "right-20" : "left-4"}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </button>

                <aside
                    className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#161616] text-white p-4 flex flex-col justify-between border-r border-gray-700 transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}
                >
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-center">Chat Bot AI</h2>

                        <div className="w-full h-px bg-gray-600 my-4"></div>

                        <ul>
                            <li className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2">
                                <FontAwesomeIcon icon={faHouse} />
                                Home
                            </li>
                            <li className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2">
                                <FontAwesomeIcon icon={faComments} />
                                Chat AI
                            </li>
                            <li className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2">
                                <FontAwesomeIcon icon={faFolderOpen} />
                                Projects
                            </li>

                            <li
                                className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2 block md:hidden"
                                onClick={() => {
                                    setShowHistoryPanel(true);
                                    setIsOpen(false); // Close sidebar
                                }}
                            >
                                <FontAwesomeIcon icon={faFolderOpen} />
                                History
                            </li>
                        </ul>

                    </div>

                    <div className={`${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}>
                        <div className="bg-white text-blue-800 p-3 rounded-lg shadow-md">
                            <p className="text-sm font-semibold">🚀 2x faster</p>
                            <p className="text-xs">by purchasing paid version</p>
                        </div>

                        <div className="w-full h-px bg-gray-600 my-4"></div>

                        <button className="w-full hover:bg-[#f86009] text-white py-2 px-4 rounded text-sm flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            Logout
                        </button>
                    </div>
                </aside>

                {isOpen && (
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    />
                )}
            </div>

        </>

    )
}
