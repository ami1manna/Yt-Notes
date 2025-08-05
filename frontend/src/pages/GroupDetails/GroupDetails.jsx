import GroupDetailsHeader from "@/components/groupdetails/GroupDetailsHeader";
import GroupDetailsBody from "@/components/groupdetails/GroupDetailsBody";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";

// redux
// group details
import { useDispatch, useSelector } from "react-redux";
import { groupDetailThunks, groupDetailSelectors } from "@/store/groupDetails";
import { clearGroupDetails } from "@/store/groupDetails/groupDetailSlice";
import { useAuth } from "@/context/auth/AuthContextBase";
 

import AsyncStateHandler from "@/components/common/AsyncStateHandler";
import { usePresence } from "../../store/presence/usePresence";

const GroupDetails = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  
  const user = useAuth();

  usePresence({ groupId,   user })
  
 
  // Fetch group details
  useEffect(() => {
    dispatch(groupDetailThunks.fetchGroupDetails(groupId));

    return () => {
      dispatch(clearGroupDetails()); // cleanup on unmount
    };
  }, [groupId, dispatch]);
 
  const isLoading = useSelector(groupDetailSelectors.isGroupDetailsFetching);
  const error = useSelector(groupDetailSelectors.getGroupDetailsFetchError);

  return (
    <div className="flex flex-col w-full h-full p-4 gap-4">
      {/* Wrap both header and body in AsyncStateHandler */}
      <AsyncStateHandler isLoading={isLoading} error={error}>
        <>
          <GroupDetailsHeader />
          <GroupDetailsBody />
        </>
      </AsyncStateHandler>
    </div>
  );
};

export default GroupDetails;
