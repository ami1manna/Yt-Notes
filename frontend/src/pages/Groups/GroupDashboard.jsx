import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups } from '@/store/slices/groupSlice';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import GroupStats from '../../components/group/GRoupStats';
import GroupList from '../../components/group/GroupList';
const GroupDashboard = () => {
  const dispatch = useDispatch();

  // Access state values correctly
  const { groupList, loading, error } = useSelector((state) => state.group);
  

  useEffect(() => {
    dispatch(fetchGroups()); 
  }, [dispatch]);
 
  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Error></Error>;
  }
  
  return (
    <div className='w-full px-4 h-full'>
       
       <GroupStats/>  
      <GroupList/>
    </div>
  );
};

export default GroupDashboard;
