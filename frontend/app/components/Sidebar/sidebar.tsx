import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faRightFromBracket, faHouse, faComments, faFolderOpen, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import History from "../../components/History/history";
import Modal from "../ui/Modal/modal";

interface SidebarProps {
    setShowHistoryPanel: (value: boolean) => void;
    isOpen?: boolean;
    onClose?: () => void;
    showHistoryPanel: boolean;
    isMobile?: boolean;
}

export default function Sidebar({
    setShowHistoryPanel,
    showHistoryPanel,
    isMobile = false,
}: SidebarProps) {
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
                    className={`md:hidden fixed top-3 z-50 bg-ray-800 text-white p-2 rounded ${isOpen ? "right-20" : "left-4"
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </button>

                <aside
                    className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#161616] text-white p-4 flex flex-col justify-between border-r border-gray-700 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}
                >
                    {showHistoryPanel && isMobile ? (
                        <div>
                            <button
                                onClick={() => setShowHistoryPanel(false)}
                                className="mb-4 p-2 rounded text-white bg-[#f86009] flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                Back to Menu
                            </button>
                            <History />
                        </div>
                    ) : (
                        <div>
                            <Link to="/home">
                                <h2 className="text-xl font-bold mb-6 text-center cursor-pointer">Chat Bot AI</h2></Link>
                            <div className="w-full h-px bg-gray-600 my-4"></div>

                            <ul>
                                <Link to="/home">
                                    <li className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2">
                                        <FontAwesomeIcon icon={faHouse} />
                                        Home
                                    </li>
                                </Link>

                                <Link to="/home/new">
                                    <li className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2">
                                        <FontAwesomeIcon icon={faComments} />
                                        Chat AI
                                    </li>
                                </Link>

                                <Link to="/library">
                                    <li className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2">
                                        <FontAwesomeIcon icon={faFolderOpen} />
                                    Library
                                    </li>
                                </Link>

                                <li
                                    className="mb-4 hover:bg-[#f86009] p-2 rounded cursor-pointer flex items-center gap-2 block md:hidden"
                                    onClick={() => {
                                        setShowHistoryPanel(true);
                                        setIsOpen(false); // close sidebar on mobile after click
                                    }}
                                >
                                    <FontAwesomeIcon icon={faFolderOpen} />
                                    History
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className={`${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}>
                        <div className="bg-white text-blue-800 p-3 rounded-lg shadow-md">
                            <p className="text-sm font-semibold">🚀 2x faster</p>
                            <p className="text-xs">by purchasing paid version</p>
                        </div>

                        <div className="w-full h-px bg-gray-600 my-4"></div>

                        <Modal
                            title="Confirm Logout"
                            message="Are you sure you want to log out?"
                            onConfirm={handleLogout}
                            triggerLabel="Logout"
                            icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                        />
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
    );
}
