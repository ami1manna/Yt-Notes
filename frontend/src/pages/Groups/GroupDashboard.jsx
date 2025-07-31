import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups } from '@/store/slices/groupSlice';
 
const GroupDashboard = () => {
  const dispatch = useDispatch();

  // Access state values correctly
  const { groupList, loading, error } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(fetchGroups()); 
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }
  
  return (
    <div >
      {groupList.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <ul>
          {groupList.map((group) => (
            <li key={group._id}>{group.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupDashboard;
