import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupContext } from '../context/GroupContext';

const GroupCreate = () => {
  const navigate = useNavigate();
  const { createGroup } = useGroupContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { success, error } = await createGroup({ name, description, privacy });
    setLoading(false);
    if (success) {
      setSuccess(true);
      setTimeout(() => navigate('/groups'), 1200);
    } else {
      setError(error || 'Failed to create group.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Group</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Group Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Privacy</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={privacy}
            onChange={e => setPrivacy(e.target.value)}
            disabled={loading}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </button>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        {success && <div className="text-green-600 text-center mt-2">Group created! Redirecting...</div>}
      </form>
    </div>
  );
};

export default GroupCreate; 