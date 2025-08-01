import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGroupByIdAPI } from "./groupDetailService";

export const fetchGroupDetails = 
createAsyncThunk('groupDetails/fetchGroupDetails', 
    async (groupId, thunkAPI) => {

        const { groupDetails, error } = await fetchGroupByIdAPI(groupId);
        if (error) return thunkAPI.rejectWithValue(error);
        return groupDetails;
})