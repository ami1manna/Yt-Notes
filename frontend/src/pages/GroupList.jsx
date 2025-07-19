import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupContext } from '../context/GroupContext';

const GroupList = () => {
  const navigate = useNavigate();
  const {
    groupList,
    groupListLoading,
    groupListError,
    fetchGroups,
  } = useGroupContext();

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, []);

  const handleViewDetails = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    navigate('/groups/create');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <button
          onClick={handleCreateGroup}
          className="py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          + Create Group
        </button>
      </div>
      {groupListLoading ? (
        <div className="text-center py-10">Loading groups...</div>
      ) : groupListError ? (
        <div className="text-center py-10 text-red-500">{groupListError}</div>
      ) : groupList.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No groups found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {groupList.map(group => (
            <div key={group._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex flex-col">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{group.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">{group.description}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded ${group.privacy === 'public' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{group.privacy}</span>
              </div>
              <button
                onClick={() => handleViewDetails(group._id)}
                className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList; 