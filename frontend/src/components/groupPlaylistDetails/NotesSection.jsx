 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collabNoteThunks, collabNoteSelectors } from "@/store/collabNote";
import AsyncStateHandler from "@/components/common/AsyncStateHandler";
import { groupPlaylistDetailsSelectors } from "../../store/groupPlaylist";
import { Save, FileText } from "lucide-react";
import IconButton from "@/components/common/IconButton";
import { clearNote } from "../../store/collabNote/collabNoteSlice";
import RichTextEditor from "@/components/editor/RichTextEditor";

const NotesSection = ({ groupId, playlistId }) => {
  const dispatch = useDispatch();
  const note = useSelector(collabNoteSelectors.getCollabNoteContent);
  const status = useSelector(collabNoteSelectors.getCollabNoteStatus);
  const error = useSelector(collabNoteSelectors.getCollabNoteError);
  const video = useSelector(groupPlaylistDetailsSelectors.getCurrentVideo);

  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (video?.videoId) {
      dispatch(
        collabNoteThunks.fetchNote({
          videoId: video.videoId,
          playlistId,
          groupId,
        })
      );
    }
    return () => {
      dispatch(clearNote());
    };
  }, [dispatch, video, playlistId, groupId]);

  useEffect(() => {
    setEditorContent(note || "");
  }, [note, video]);

  const handleNoteSave = () => {
    dispatch(
      collabNoteThunks.saveNote({
        videoId: video?.videoId,
        playlistId,
        groupId,
        content: editorContent,
      })
    );
  };

  return (
    <AsyncStateHandler
      isLoading={status === "loading"}
      error={error}
      loadingMessage="Loading Note..."
      errorMessagePrefix="Failed to load note:"
    >
      <div className="bg-gray-900 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold text-white">Notes</h2>
                <p className="text-sm text-gray-400">
                  {video?.title || "Select a video to take notes"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-700 border border-cyan-500/20">
                <div
                  className={`w-2 h-2 rounded-full ${
                    status === "loading"
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-cyan-400"
                  }`}
                />
                <span className="text-xs text-gray-300">
                  {status === "loading" ? "Syncing..." : "Synced"}
                </span>
              </div>

              <IconButton
                icon={Save}
                isLoading={status === "loading"}
                onClick={handleNoteSave}
                className="h-8 bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Save
              </IconButton>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 overflow-auto">
          {video?.videoId ? (
            <RichTextEditor
              value={editorContent}
              onChange={setEditorContent}
              className="h-full"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-center text-gray-400">
              Select a video to start taking notes.
            </div>
          )}
        </div>
      </div>
    </AsyncStateHandler>
  );
};

export default NotesSection;
