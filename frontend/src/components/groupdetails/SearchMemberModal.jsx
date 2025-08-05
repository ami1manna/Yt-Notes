import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/Dialogs/ModalContainer";
import { X, Search, Plus, Send, Trash2 } from "lucide-react";
import IconButton from "@/components/common/IconButton";
import { debounce } from "lodash";
import { searchUsersByUsername } from "@/utils/UserUtils";
import { toast } from "react-toastify";
import { inviteToGroup } from "../../utils/GroupUtils";

const SearchMemberModal = ({ isOpen, onClose, groupId }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const inputRef = useRef(null);
  const [inviteResults, setInviteResults] = useState([]); // new state to show response

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setUsers([]);
      setError("");
      setSelectedEmails([]);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

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
    }, 500)
  ).current;

  useEffect(() => {
    debouncedSearch(query.trim());
  }, [query]);

  const handleAddEmail = (email) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails((prev) => [...prev, email]);
    }
  };

  const handleRemoveEmail = (email) => {
    setSelectedEmails((prev) => prev.filter((e) => e !== email));
  };


  const handleSendInvites = async () => {
    if (!selectedEmails.length) return;

    const response = await inviteToGroup(groupId, selectedEmails);

    if (response.success) {
      setInviteResults(response.results);

      // Remove successful ones from selection
      const failed = response.results.filter(r => !r.success).map(r => r.email);
      setSelectedEmails(failed);

      // Optional: toast or alert for success
    } else {
      console.error("Invite error:", response.error);
      // Optional: toast for general failure
    }
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

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Selected Emails */}
          {selectedEmails.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded-full"
                >
                  <span className="mr-1 text-gray-900 dark:text-white">{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />

          {error && <div className="text-sm text-red-500">{error}</div>}

          {/* Search Results */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Search className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          ) : users.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
                >
                  <span className="text-gray-900 dark:text-gray-100">{user.username}</span>
                  <IconButton
                    onClick={() => handleAddEmail(user.email)}
                    icon={Plus}
                    iconPosition="right"
                    className="text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 h-8"
                  >
                    Add
                  </IconButton>
                </li>
              ))}
            </ul>
          ) : (
            query.length >= 2 && (
              <p className="text-sm text-gray-500 text-center">No users found</p>
            )
          )}

          {/* Invite Button */}
          <div className="pt-2">
            <IconButton
              onClick={handleSendInvites}
              icon={Send}
              disabled={selectedEmails.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2"
            >
              Send Invites
            </IconButton>
            {inviteResults.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto space-y-2 pr-2">
                {inviteResults.map((res) => (
                  <div
                    key={res.email}
                    className={`text-sm px-3 py-2 rounded-md ${res.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {res.success
                      ? `✅ Invite sent to ${res.email}`
                      : `❌ ${res.email} - ${res.message}`}
                  </div>
                ))}
              </div>
            )}



          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchMemberModal;
