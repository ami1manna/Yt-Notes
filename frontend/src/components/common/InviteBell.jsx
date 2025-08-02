import React, { useEffect, useState, useCallback } from "react";
import { Bell, Check, X, Users, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { inviteThunks, inviteSelectors } from "@/store/invite";
import ModalContainer from "@/components/dialogs/ModalContainer"; // adjust path if needed

const InviteBell = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [respondingId, setRespondingId] = useState(null);

  const invites = useSelector(inviteSelectors.selectInviteList);
  const isFetching = useSelector(inviteSelectors.isInviteFetching);
  const fetchError = useSelector(inviteSelectors.getInviteFetchError);
  const isResponding = useSelector(inviteSelectors.isInviteResponding);
  const respondError = useSelector(inviteSelectors.getInviteRespondError);

  useEffect(() => {
    dispatch(inviteThunks.fetchMyInvites());
  }, [dispatch]);

  const handleRespond = useCallback(async (inviteId, action) => {
    setRespondingId(inviteId);
    try {
      await dispatch(inviteThunks.respondToInvite({ inviteId, action }));
      setTimeout(() => setIsModalOpen(false), 500);
    } finally {
      setRespondingId(null);
    }
  }, [dispatch]);

  const getInviteCount = () => invites?.length || 0;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative p-2 rounded-full transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
          isModalOpen 
            ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
        }`}
        aria-label={`Invitations (${getInviteCount()})`}
      >
        <Bell className={`w-5 h-5 ${getInviteCount() > 0 ? 'animate-pulse' : ''}`} />
        {getInviteCount() > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
            {getInviteCount() > 9 ? '9+' : getInviteCount()}
          </span>
        )}
      </button>

      <ModalContainer isOpen={isModalOpen}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-500 dark:text-teal-400" />
              Group Invitations
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4">
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full" />
                Loading...
              </div>
            )}

            {fetchError && (
              <div className="text-sm text-red-500 dark:text-red-400">
                Failed to load invites.
                <button
                  onClick={() => dispatch(inviteThunks.fetchMyInvites())}
                  className="ml-2 underline text-xs text-teal-600 dark:text-teal-400"
                >
                  Retry
                </button>
              </div>
            )}

            {!isFetching && invites.length === 0 && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                No pending invitations.
              </div>
            )}

            {!isFetching &&
              invites.map((invite) => {
                const isProcessing = respondingId === invite._id;
                const groupName = invite.group?.name || invite.groupName || "Unknown Group";
                const groupDescription = invite.group?.description || invite.groupDescription || "";

                return (
                  <div
                    key={invite._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {groupName}
                      </h4>
                      {groupDescription && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {groupDescription}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespond(invite._id, "accept")}
                        disabled={isResponding || isProcessing}
                        className={`flex-1 py-1.5 rounded text-sm font-medium flex items-center justify-center gap-1 transition ${
                          isProcessing
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {isProcessing ? (
                          <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(invite._id, "reject")}
                        disabled={isResponding || isProcessing}
                        className={`flex-1 py-1.5 rounded text-sm font-medium flex items-center justify-center gap-1 transition ${
                          isProcessing
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {isProcessing ? (
                          <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {respondError && (
            <div className="mt-4 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <X className="w-3 h-3" />
              Failed to respond. Please try again.
            </div>
          )}
        </div>
      </ModalContainer>
    </>
  );
};

export default InviteBell;
