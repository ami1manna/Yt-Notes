// groupId -> Map<socketId, userInfo>
const presenceMap = new Map();

const getUsers = (groupId) => {
  const group = presenceMap.get(groupId);
  return group ? Array.from(group.values()) : [];
};

const addUser = (groupId, socketId, userInfo) => {
  if (!presenceMap.has(groupId)) {
    presenceMap.set(groupId, new Map());
  }
  presenceMap.get(groupId).set(socketId, userInfo);
};

const updateUser = (groupId, socketId, updates) => {
  const group = presenceMap.get(groupId);
  if (group && group.has(socketId)) {
    const user = group.get(socketId);
    group.set(socketId, { ...user, ...updates });
  }
};

const removeUser = (groupId, socketId) => {
  const group = presenceMap.get(groupId);
  if (group) {
    group.delete(socketId);
    if (group.size === 0) {
      presenceMap.delete(groupId);
    }
  }
};

module.exports = {
  presenceMap,
  getUsers,
  addUser,
  updateUser,
  removeUser,
};
