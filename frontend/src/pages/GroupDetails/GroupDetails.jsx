import GroupDetailsHeader from '@/components/groupdetails/GroupDetailsHeader';
import GroupDetailsBody from '../../components/groupdetails/GroupDetailsBody';
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

    <div className='flex flex-col w-full p-4 gap-4'>
      
      {/* header */}
      <AsyncStateHandler isLoading={isLoading} error={error}>
        <GroupDetailsHeader/>
      </AsyncStateHandler>


    <GroupDetailsBody/>
    </div>
  )

}

export default GroupDetails
