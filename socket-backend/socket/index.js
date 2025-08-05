const groupPresenceHandlers = require("./groupHandlers");

module.exports = (io, socket) => {
  groupPresenceHandlers(io, socket);
};
