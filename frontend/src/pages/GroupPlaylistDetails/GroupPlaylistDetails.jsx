import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  groupPlaylistDetailsThunks,
  groupPlaylistDetailsSelectors,
} from "@/store/groupPlaylist";

import { clearGroupPlaylistDetails } from "@/store/groupPlaylist/groupPlaylistSlice";
import AsyncStateHandler from "@/components/common/AsyncStateHandler";

import SidebarNav from "@/components/groupPlaylistDetails/sidebar/SidebarNav ";
import MainSection from "@/components/groupPlaylistDetails/MainSection";
import NotesSection from "@/components/groupPlaylistDetails/NotesSection";
import TopBar from "@/components/groupPlaylistDetails/TopBar";

const GroupPlaylistDetails = () => {
  const { groupId, playlistId } = useParams();
  const dispatch = useDispatch();

  // Selectors
  const groupPlaylistDetails = useSelector(
    groupPlaylistDetailsSelectors.getGroupPlaylistDetails
  );
  const isLoading = useSelector(
    groupPlaylistDetailsSelectors.isGroupPlaylistDetailsFetching
  );
  const error = useSelector(
    groupPlaylistDetailsSelectors.getGroupPlaylistDetailsFetchError
  );

  useEffect(() => {
    if (groupId && playlistId) {
      dispatch(
        groupPlaylistDetailsThunks.fetchGroupPlaylistDetails({ groupId, playlistId })
      );
    }

    return () => {
      dispatch(clearGroupPlaylistDetails());
    };
  }, [dispatch, groupId, playlistId]);

  return (
<AsyncStateHandler
      isLoading={isLoading}
      error={error}
      loadingMessage="Fetching shared playlist..."
      errorMessagePrefix="Failed to fetch:"
    >
      <div className="flex h-screen overflow-hidden">
        {/* Floating SidebarNav is assumed to be fixed */}
        <SidebarNav />

        {/* Main content area (TopBar + content sections) */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />

          <div className="flex flex-1 overflow-hidden">
            <MainSection />
            <NotesSection />
          </div>
        </div>
      </div>
    </AsyncStateHandler>
  );
};

export default GroupPlaylistDetails;
