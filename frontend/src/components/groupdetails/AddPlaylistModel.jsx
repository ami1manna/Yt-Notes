import React, { useState } from "react";
import Modal from "@/components/Dialogs/ModalContainer";
import { X, Plus } from "lucide-react";
import IconButton from "@/components/common/IconButton";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { groupDetailThunks } from "../../store/groupDetails";
import { extractPlaylistId } from "@/utils/PlaylistUtils";

const AddPlaylistModal = ({ isOpen, onClose, groupId }) => {
  const [playlistId, setPlaylistId] = useState("");
  const [isSectioned, setIsSectioned] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const trimmedUrl = playlistId.trim();
    if (!trimmedUrl) {
      toast.error("Playlist ID is required.");
      return;
    }
    //  SEEE IF VALID PLAYLIST ID 
     const playId = extractPlaylistId(trimmedUrl);
        if (typeof playlistId === "object" && playlistId.error) {
          toast.error(playlistId.error, { position: "top-right", icon: "❌" });
          inputRef.current?.focus();
          return false;
        }
        // console.log({groupId, playId, isSectioned});
    dispatch(
      groupDetailThunks.sharePlaylistWithGroup({ groupId, playlistId:playId, isSectioned })
    );

    setPlaylistId("");
    setIsSectioned(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add Playlist
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <input
            type="text"
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            placeholder="Playlist ID"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />

          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={isSectioned}
              onChange={(e) => setIsSectioned(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <span>Arrange in Sections?</span>
          </label>

          <IconButton
            onClick={handleSubmit}
            icon={Plus}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2"
          >
            Add Playlist
          </IconButton>
        </div>
      </div>
    </Modal>
  );
};

export default AddPlaylistModal;
