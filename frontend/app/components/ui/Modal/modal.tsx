import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";


const modal = ({ handleLogout }: { handleLogout: () => void }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full hover:bg-[#f86009] text-white py-2 px-4 rounded text-sm flex items-center gap-2 cursor-pointer">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Logout
                </button>
            </DialogTrigger>

            <DialogContent className="bg-black text-white border-none rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-white">Confirm Logout</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to log out?</p>
                <DialogFooter className="mt-4 flex justify-end gap-2 cursor-pointer">
                    <Button variant="ghost" onClick={() => document.body.click()}>
                        Cancel
                    </Button>
                    <Button className="bg-[#f86009] text-white" onClick={handleLogout}>
                        Logout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default modal;