import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/components/dialogs/ModalContainer";
import { Loader2, Globe, Lock, X } from "lucide-react";
import { createGroup } from "@/store/slices/groupSlice";

const GroupForm = ({ isOpen, onClose, onGroupCreated }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.group);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const nameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setPrivacy("public");
      setTimeout(() => nameRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      const created = await dispatch(
        createGroup({
          name: trimmedName,
          description: description.trim(),
          privacy,
        })
      ).unwrap();

      onGroupCreated?.(created);
      onClose();
    } catch {
      // error is surfaced from slice; no further local handling needed
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Create New Group
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Create a collaborative space for sharing YouTube playlists and notes
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            <div>
              <label
                htmlFor="group-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Group Name
              </label>
              <input
                id="group-name"
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name..."
                disabled={loading}
                required
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="group-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Description
              </label>
              <textarea
                id="group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your group's purpose..."
                rows={3}
                disabled={loading}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Privacy
              </span>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer text-sm ${
                    privacy === "public"
                      ? "border-blue-500 bg-blue-50 dark:bg-gray-700"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="mt-1">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Public</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Anyone can find and join
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={privacy === "public"}
                    onChange={() => setPrivacy("public")}
                    disabled={loading}
                    className="sr-only"
                  />
                </label>

                <label
                  className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer text-sm ${
                    privacy === "private"
                      ? "border-blue-500 bg-blue-50 dark:bg-gray-700"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="mt-1">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Private</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Invite only
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={privacy === "private"}
                    onChange={() => setPrivacy("private")}
                    disabled={loading}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2 rounded-md border text-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create & Go to Group"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default GroupForm;
