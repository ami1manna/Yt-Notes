import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPresence, clearPresence } from "@/store/presence/presenceSlice";
 
import socket from "@/sockets";
 

export const usePresence = ({
  groupId,
  playlistId = null,
  videoId = null,
  noteId = null,
  notesContent = "",
  user, // { userId, username, email }
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!groupId || !user) return;
    
    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    const userPresence = {
      ...user.user,
      selectedPlaylistId: playlistId,
      selectedVideoId: videoId,
      currentNoteId: noteId,
      notesContent,
    };

    // 1. Join group
    socket.emit("join_group", { groupId, user: userPresence });

    // 2. Listen for updates
    socket.on("group_presence_update", ({ users }) => {
      const enriched = users.map((u, idx) => ({
        ...u,
        socketId: Object.keys(users)[idx] ?? `sock-${idx}`,
      }));
      dispatch(setPresence(enriched));
    });

    // 3. Emit presence update
    socket.emit("update_presence", {
      groupId,
      updates: {
        selectedPlaylistId: playlistId,
        selectedVideoId: videoId,
        currentNoteId: noteId,
        notesContent,
      },
    });

    // 4. Cleanup on unmount
    return () => {
      console.log("usePresence cleanup");
      dispatch(clearPresence());
      socket.off("group_presence_update");
      socket.disconnect();
      
    };
  }, [groupId, playlistId, videoId, noteId, notesContent, user, dispatch]);
};
