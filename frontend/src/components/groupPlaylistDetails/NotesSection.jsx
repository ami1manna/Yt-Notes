import RichTextEditor from "@/components/common/RichTextEditor";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collabNoteThunks, collabNoteSelectors } from "@/store/collabNote";
import AsyncStateHandler from "@/components/common/AsyncStateHandler";
import { groupPlaylistDetailsSelectors } from "../../store/groupPlaylist";
import {  PencilIcon } from "lucide-react";

import IconButton from "@/components/common/IconButton";

const NotesSection = ({ groupId, playlistId }) => {
  const dispatch = useDispatch();
  const note = useSelector(collabNoteSelectors.getCollabNote);
  const status = useSelector(collabNoteSelectors.getCollabNoteStatus);
  const error = useSelector(collabNoteSelectors.getCollabNoteError);
  console.log(note);
  const video = useSelector(groupPlaylistDetailsSelectors.getCurrentVideo);
  console.log(video?.videoId);
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(
      collabNoteThunks.fetchNote({
        videoId: video?.videoId,
        playlistId,
        groupId,
      })
    );
  }, [dispatch, video, playlistId, groupId]);

  const handleTextChange = (newText) => {
    setText(newText);
  };

  if (!note) {
    return (
      <div className="h-20">
        <IconButton
          icon={PencilIcon}
          isLoading={false}
          onClick={() => console.log("clicked")}
        >
          Create Note
        </IconButton>
      </div>
    );
  }
  return (
    <AsyncStateHandler
      isLoading={status === "loading"}
      error={error}
      loadingMessage="Loading Note..."
      errorMessagePrefix="Failed to load note:"
    >
      <div className="bg-blue-600 flex-1 relative p-4">
        <RichTextEditor value={note} onChange={handleTextChange} />
      </div>
    </AsyncStateHandler>
  );
};

export default NotesSection;
