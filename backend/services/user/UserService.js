// services/user/searchUsersService.js

const User = require("../../models/users/userModel");

exports.searchUsersService = async (query) => {
  const regex = new RegExp(query, 'i'); // case-insensitive match

  const users = await User.find(
    { username: regex },
    { username: 1, email: 1, _id: 0 }  
  ).limit(10);

  return users;
};
