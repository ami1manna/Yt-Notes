import axios from "axios";

export const searchUsersByUsername = async (query) => {
  const res = await axios.get(`/user/search?q=${encodeURIComponent(query)}`);
  return res.data;
};
