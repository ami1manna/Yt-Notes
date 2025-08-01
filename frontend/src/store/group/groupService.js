import axios from "axios";

export async function fetchGroupsAPI() {
  try {
    const res = await axios.get("/groups");
    if (res.data && res.data.success) {
      return { groups: res.data.groups, error: null };
    } else {
      return { groups: [], error: res.data?.message || "Failed to fetch groups." };
    }
  } catch (err) {
    return {
      groups: [],
      error: err.response?.data?.message || "Failed to fetch groups.",
    };
  }
}

export async function createGroupAPI({ name, description, privacy }) {
  try {
    const res = await axios.post("/groups", { name, description, privacy });
    if (res.data && res.data.success) {
      return { group: res.data.group, error: null };
    } else {
      return { group: null, error: res.data?.message || "Failed to create group." };
    }
  } catch (err) {
    return {
      group: null,
      error: err.response?.data?.message || "Failed to create group.",
    };
  }
}


