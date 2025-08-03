import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  groupPlaylistDetailsThunks,
  groupPlaylistDetailsSelectors,
} from "@/store/groupPlaylist";

import { clearGroupPlaylistDetails } from "@/store/groupPlaylist/groupPlaylistSlice";
import AsyncStateHandler from "@/components/common/AsyncStateHandler";

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
      <div>
        <h2 className="text-xl font-semibold mb-2">Playlist Details</h2>
        <pre>{JSON.stringify(groupPlaylistDetails, null, 2)}</pre>
      </div>
    </AsyncStateHandler>
  );
};

export default GroupPlaylistDetails;
