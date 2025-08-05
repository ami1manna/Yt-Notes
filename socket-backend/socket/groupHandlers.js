const {
  getUsers,
  addUser,
  updateUser,
  removeUser,
} = require("./presenceMap");

module.exports = function groupPresenceHandlers(io, socket) {
  let currentGroupId = null;

  const emitPresence = (groupId) => {
    const users = getUsers(groupId);
    io.to(groupId).emit("group_presence_update", { groupId, users });
  };

  socket.on("join_group", ({ groupId, user }) => {
    currentGroupId = groupId;
    socket.join(groupId);
    addUser(groupId, socket.id, user);
    emitPresence(groupId);
    console.log(`👥 ${user.username} joined group ${groupId}`);
  });

  socket.on("update_presence", ({ groupId, updates }) => {
    updateUser(groupId, socket.id, updates);
    emitPresence(groupId);
  });

  socket.on("disconnect", () => {
    if (currentGroupId) {
      const groupId = currentGroupId;
      removeUser(groupId, socket.id);
      emitPresence(groupId);
      console.log(`❌ Socket ${socket.id} left group ${groupId}`);
    }
  });
};
