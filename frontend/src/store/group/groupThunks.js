import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGroupsAPI, createGroupAPI, fetchGroupByIdAPI } from "./groupService";

export const fetchGroups = createAsyncThunk(
  "group/fetchGroups",
  async (_, thunkAPI) => {
    const { groups, error } = await fetchGroupsAPI();
    if (error) return thunkAPI.rejectWithValue(error);
    return groups;
  }
);

export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (groupPayload, thunkAPI) => {
    const { group, error } = await createGroupAPI(groupPayload);
    if (error) return thunkAPI.rejectWithValue(error);
    return { ...group, role: "admin" };
  }
);

export const fetchGroupDetails = createAsyncThunk(
  "group/fetchGroupDetails",
  async (groupId, thunkAPI) => {
    const { group, error } = await fetchGroupByIdAPI(groupId);
    if (error) return thunkAPI.rejectWithValue(error);
    return group;
  }
)