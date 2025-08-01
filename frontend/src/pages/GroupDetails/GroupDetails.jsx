import GroupDetailsHeader from '@/components/groupdetails/GroupDetailsHeader';
import GroupDetailsBody from '@/components/groupdetails/GroupDetailsBody';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {groupDetailThunks , groupDetailSelectors} from '@/store/groupDetails'
import { clearGroupDetails } from '@/store/groupDetails/groupDetailSlice';
import AsyncStateHandler from '@/components/common/AsyncStateHandler';

const GroupDetails = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  // const group = useSelector(groupDetailThunks.getGroupDetails);
  const isLoading = useSelector(groupDetailSelectors.isGroupDetailsFetching);
  const error = useSelector(groupDetailSelectors.getGroupDetailsFetchError);


  useEffect(()=>{
    dispatch(groupDetailThunks.fetchGroupDetails(groupId));
    
     return () => {
      dispatch(clearGroupDetails()); // cleanup on unmount
    };
  },[groupId]);
  
  return (

    <div className='flex flex-col w-full h-full p-4 gap-4'>
      
      {/* Wrap both header and body in AsyncStateHandler */}
      <AsyncStateHandler isLoading={isLoading} error={error}>
        <>
          <GroupDetailsHeader/>
          <div className='flex-1 min-h-0'>
            <GroupDetailsBody/>
          </div>
        </>
      </AsyncStateHandler>
    </div>
  )

}

export default GroupDetails
