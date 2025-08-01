import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/dialogs/ModalContainer";
import { X, Search, Send } from "lucide-react";
import IconButton from "@/components/common/IconButton";
import { debounce } from "lodash"; // OR use your custom hook
import { searchUsersByUsername } from "@/utils/UserUtils"; 
const SearchMemberModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setUsers([]);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchTerm) => {
      if (!searchTerm || searchTerm.length < 2) return;

      setLoading(true);
      setError("");
      try {
        const data = await searchUsersByUsername(searchTerm);
        setUsers(data.users);
      } catch (err) {
        setUsers([]);
        setError("Something went wrong while searching.");
      } finally {
        setLoading(false);
      }
    }, 2000)
  ).current;

  useEffect(() => {
    debouncedSearch(query.trim());
  }, [query]);

  const handleInvite = (userId) => {
    console.log("Invite sent to:", userId);
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Invite Members
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 space-y-4">
          <div className="flex gap-2 h-10 ">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />

            <IconButton
              onClick={() => debouncedSearch(query.trim())}
              icon={Search}
              isLoading={loading}
              iconPosition="left"
              className="px-3 "
            >
              Search
            </IconButton>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Search className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          ) : users.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
                >
                  <span className="text-gray-900 dark:text-gray-100">
                    {user.username}
                  </span>
                  <IconButton
                    onClick={() => handleInvite(user._id)}
                    icon={Send}
                    iconPosition="right"
                    className="text-sm bg-green-600 hover:bg-green-700 px-2 py-1 h-8"
                  >
                    Invite
                  </IconButton>
                </li>
              ))}
            </ul>
          ) : (
            query.length >= 2 && (
              <p className="text-sm text-gray-500 text-center">No users found</p>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchMemberModal;
