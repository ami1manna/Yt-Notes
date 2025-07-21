import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGroupById, fetchPlaylistSummary, fetchSharedPlaylistsForGroup } from '../utils/GroupUtils';
import { useGroupContext } from '../context/GroupContext';
import { AuthContext } from '../context/auth/AuthContextBase';
import { fetchUserPlaylistSummaries } from '../utils/PlaylistUtils';
import StaticModal from '../components/Dialogs/StaticModal';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { updateGroup, deleteGroup, sharePlaylistWithGroup, inviteToGroup } = useGroupContext();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', description: '', privacy: 'private' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [sharedPlaylists, setSharedPlaylists] = useState([]);
  const [sharedPlaylistsLoading, setSharedPlaylistsLoading] = useState(false);
  const [sharedPlaylistsError, setSharedPlaylistsError] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [userPlaylistsLoading, setUserPlaylistsLoading] = useState(false);
  const [userPlaylistsError, setUserPlaylistsError] = useState(null);
  const [sharePlaylistId, setSharePlaylistId] = useState('');
  const [showArrangeModal, setShowArrangeModal] = useState(false);
  const [pendingArrangeFlag, setPendingArrangeFlag] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      setError(null);
      const { group, error } = await fetchGroupById(groupId);
      setGroup(group);
      setError(error);
      setLoading(false);
      if (group) {
        setEditData({
          name: group.name || '',
          description: group.description || '',
          privacy: group.privacy || 'private',
        });
      }
    };
    loadGroup();
  }, [groupId]);

  useEffect(() => {
    const fetchShared = async () => {
      setSharedPlaylistsLoading(true);
      setSharedPlaylistsError(null);
      const { sharedPlaylists, error } = await fetchSharedPlaylistsForGroup(groupId);
      setSharedPlaylists(sharedPlaylists || []);
      setSharedPlaylistsError(error);
      setSharedPlaylistsLoading(false);
    };
    fetchShared();
  }, [groupId, group]);

  const isAdmin = group && user && group.members && group.members.some(m => m.userId === user.userId && m.role === 'admin');

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    const { success, error } = await updateGroup(groupId, editData);
    setEditLoading(false);
    if (success) {
      setEditMode(false);
      // Refresh group data
      const { group } = await fetchGroupById(groupId);
      setGroup(group);
    } else {
      setEditError(error || 'Failed to update group.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
    setDeleteLoading(true);
    setDeleteError(null);
    const { success, error } = await deleteGroup(groupId);
    setDeleteLoading(false);
    if (success) {
      navigate('/groups');
    } else {
      setDeleteError(error || 'Failed to delete group.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading group...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!group) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
      <p className="mb-2 text-gray-600 dark:text-gray-300">{group.description}</p>
      <span className={`inline-block px-2 py-1 text-xs rounded mb-4 ${group.privacy === 'public' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{group.privacy}</span>

      {isAdmin && !editMode && (
        <div className="flex gap-3 mb-6">
          <button
            className="py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
          <button
            className="py-1 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
          {deleteError && <span className="text-red-500 ml-2">{deleteError}</span>}
        </div>
      )}

      {isAdmin && editMode && (
        <form onSubmit={handleEditSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Group Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={editData.name}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={editData.description}
              onChange={handleEditChange}
              rows={3}
              disabled={editLoading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Privacy</label>
            <select
              name="privacy"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={editData.privacy}
              onChange={handleEditChange}
              disabled={editLoading}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={editLoading}
            >
              {editLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="py-1 px-4 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={() => setEditMode(false)}
              disabled={editLoading}
            >
              Cancel
            </button>
          </div>
          {editError && <div className="text-red-500 mt-2">{editError}</div>}
        </form>
      )}

      {isAdmin && (
        <form
          className="flex flex-col sm:flex-row gap-2 mb-6"
          onSubmit={async e => {
            e.preventDefault();
            setInviteLoading(true);
            setInviteError(null);
            setInviteSuccess(false);
            const { success, error } = await inviteToGroup(groupId, inviteEmail);
            setInviteLoading(false);
            if (success) {
              setInviteSuccess(true);
              setInviteEmail('');
            } else {
              setInviteError(error || 'Failed to send invite.');
            }
          }}
        >
          <input
            type="email"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter email to invite"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            required
            disabled={inviteLoading}
          />
          <button
            type="submit"
            className="py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-60"
            disabled={inviteLoading}
          >
            {inviteLoading ? 'Inviting...' : 'Invite User'}
          </button>
        </form>
      )}
      {inviteError && <div className="text-red-500 mb-2">{inviteError}</div>}
      {inviteSuccess && <div className="text-green-600 mb-2">Invite sent!</div>}

      <h2 className="text-lg font-semibold mt-6 mb-2">Members</h2>
      <ul className="mb-6">
        {group.members && group.members.length > 0 ? (
          group.members.map((member, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xs">
                {String(member.userId).slice(0, 2).toUpperCase()}
              </span>
              <span className="font-medium capitalize">{member.role}</span>
              <span className="text-gray-500 text-xs">{member.userId}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No members found.</li>
        )}
      </ul>

      <h2 className="text-lg font-semibold mb-2">Shared Playlists</h2>
      {/* Share by entering Playlist ID */}
      <form
        className="flex flex-col sm:flex-row gap-2 mb-4"
        onSubmit={e => {
          e.preventDefault();
          setShowArrangeModal(true);
        }}
      >
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter Playlist ID to share"
          value={sharePlaylistId}
          onChange={e => setSharePlaylistId(e.target.value)}
          disabled={shareLoading}
          required
        />
        <button
          type="submit"
          className="py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-60"
          disabled={shareLoading}
        >
          {shareLoading ? 'Sharing...' : 'Share Playlist'}
        </button>
      </form>
      <StaticModal
        isOpen={showArrangeModal}
        isLoading={shareLoading}
        header="Organize Your Playlist"
        subHeader="Would you like to automatically group your videos into sections for better navigation?"
        onAction={async (arrange) => {
          setShowArrangeModal(false);
          setShareLoading(true);
          setShareError(null);
          setShareSuccess(false);
          // Call backend with arrangeSections flag
          const { success, error } = await sharePlaylistWithGroup(groupId, sharePlaylistId, arrange);
          setShareLoading(false);
          if (success) {
            setShareSuccess(true);
            setSharePlaylistId('');
            // Refresh group data and shared playlists
            const { group } = await fetchGroupById(groupId);
            setGroup(group);
            const { sharedPlaylists } = await fetchSharedPlaylistsForGroup(groupId);
            setSharedPlaylists(sharedPlaylists || []);
          } else {
            setShareError(error || 'Failed to share playlist.');
          }
        }}
      />
      {shareError && <div className="text-red-500 mb-2">{shareError}</div>}
      {shareSuccess && <div className="text-green-600 mb-2">Playlist shared!</div>}
      {sharedPlaylistsLoading ? (
        <div className="text-gray-400">Loading shared playlists...</div>
      ) : sharedPlaylists.length === 0 ? (
        <div className="text-gray-400">No shared playlists.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {sharedPlaylists.map((sp, idx) => (
            <div key={sp.playlistId || idx} className="bg-white dark:bg-gray-800 rounded shadow p-4 flex items-center gap-4">
              <div>
                <div className="font-semibold">Playlist ID: {sp.playlistId}</div>
                <div className="text-xs text-gray-500">Shared by: {String(sp.sharedBy).slice(0, 6)}...</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDetails; 