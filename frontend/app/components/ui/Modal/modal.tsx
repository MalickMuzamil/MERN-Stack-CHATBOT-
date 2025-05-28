import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "../dialog";
import { Button } from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    triggerLabel?: string;
    icon?: React.ReactNode;
}

const Modal = ({
    title,
    message,
    onConfirm,
    triggerLabel = "Logout",
    icon = <FontAwesomeIcon icon={faRightFromBracket} />
}: ModalProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full hover:bg-[#f86009] text-white py-2 px-4 rounded text-sm flex items-center gap-2 cursor-pointer">
                    {icon}
                    {triggerLabel}
                </button>
            </DialogTrigger>

            <DialogContent className="bg-black/80 backdrop-blur-md text-white border border-white/10 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] p-6">
                <DialogHeader>
                    <DialogTitle className="text-white text-lg">{title}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-300 mt-2">{message}</p>
                <DialogFooter className="mt-6 flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button variant="ghost" className="cursor-pointer">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className="bg-[#f86009] text-white hover:bg-[#e25500] cursor-pointer"
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
