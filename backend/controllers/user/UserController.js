const {searchUsersService} =  require('../../services/user/UserService')

// Search User 
exports.searchUsersByUsername = async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ message: 'Search query too short' });
      }
  
      const users = await searchUsersService(query.trim());
      res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
  };